// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import EventEmitter from 'eventemitter3';
import { action, computed, observable, transaction } from 'mobx';
import store from 'store';

import { range } from 'lodash';

import Contracts from '@parity/shared/lib/contracts';
import {
  fetchBuiltinApps,
  fetchLocalApps,
  fetchRegistryAppIds,
  fetchRegistryApp,
  subscribeToChanges
} from '../util/dapps';
import HashFetch from '../util/hashFetch';

const LS_KEY_DISPLAY = 'displayApps';
const LS_KEY_EXTERNAL_ACCEPT = 'acceptExternal';
const BUILTIN_APPS_KEY = 'BUILTIN_APPS_KEY';
const path = require('path');

let instance = null;

const util = require('util');

require('util.promisify').shim();

const fs = require('fs');

const fsReadFile = util.promisify(fs.readFile);

const entryCoreAbi = require('./entryCoreAbi.json');
const registryAbi = require('./entryBaseAbi.json');
const entryCoreContractAddr = '0xbbe0efe6ac55f5b1f7a8d83611f3fcd11258f1cb';
const registryContractAddr = '0x57f231060fcbaa17b31c2438ef72cd50ce1940ba';

export default class DappsStore extends EventEmitter {
  @observable apps = [];
  @observable displayApps = {};
  @observable modalOpen = false;
  @observable externalOverlayVisible = true;

  _api = null;
  _subscriptions = {};
  _cachedApps = {};
  _manifests = {};
  _registryAppsIds = null;

  constructor (api) {
    super();

    this._api = api;

    this.readDisplayApps();
    this.loadExternalOverlay();
    this.subscribeToChanges();
  }

  static get (api) {
    if (!instance) {
      instance = new DappsStore(api);
    }

    return instance;
  }

  @computed get allApps () {
    return this.apps;
  }

  @computed get sortedBuiltin () {
    return this.apps.filter((app) => app.type === 'builtin');
  }

  @computed get sortedLocal () {
    return this.apps.filter((app) => app.type === 'local');
  }

  @computed get sortedNetwork () {
    return this.apps.filter((app) => app.type === 'network');
  }

  @computed get visibleApps () {
    return this.apps.filter((app) => this.displayApps[app.id] && this.displayApps[app.id].visible);
  }

  @computed get visibleBuiltin () {
    return this.visibleApps.filter((app) => !app.noselect && app.type === 'builtin');
  }

  @computed get visibleLocal () {
    return this.visibleApps.filter((app) => app.type === 'local');
  }

  @computed get visibleNetwork () {
    return this.visibleApps.filter((app) => app.type === 'network');
  }

  @computed get visibleViews () {
    return this.visibleApps.filter((app) => !app.noselect && app.type === 'view');
  }

  @computed get pinnedApps () {
    return this.apps.filter((app) => this.displayApps[app.id] && this.displayApps[app.id].pinned);
  }

  @computed get visibleUnpinned () {
    return this.apps.filter((app) =>
      this.displayApps[app.id] &&
      this.displayApps[app.id].visible &&
      !this.displayApps[app.id].pinned
    );
  }

  deployApp (app, name, iconUrl, contentUrl, manifestUrl) {
    return new Promise(resolve => {

     const entryCoreContract = this._api.newContract(entryCoreAbi, entryCoreContractAddr);
      const registryContract = this._api.newContract(registryAbi, registryContractAddr);

      const appDeployedCallback = (e, events) => {
        const entryId = events[0].params.entryID.value.toNumber();
        entryCoreContract.instance.updateEntry.postTransaction({ }, [entryId, name, iconUrl, contentUrl, manifestUrl])
          .then((data) => {
            console.log('entry udated', data);
          });
      }

      registryContract.instance.getEntryCreationFee.call({}, []).then(data => {
        var fee = data.toNumber();
        var event = registryContract.instance.EntryCreated;

        event.subscribe({skipInitFetch: true}, appDeployedCallback, false);

        registryContract.instance.createEntry.postTransaction({ value: fee }, []).then(data => {
          console.log('entry created, data ->', data);
        });

      });

    });
  }

  /**
   * Try to find the app from the local (local or builtin)
   * apps, else fetch from the node
   */
  loadApp (ext) {
    return this
      .loadLocalApps()
      .then(() => {
        const app = this.apps.find((app) => app.ext === ext);

        if (app && ((app.type === 'local' || app.type === 'builtin') || !!app.contentHash)) {
          return app;
        } else { // it's not downloaded app from chaingear
          return this.fetchChaingerAppDefinitionById(app.chaingearId)
            .then(definition => {
              return HashFetch.get().downloadAppContent(definition)
                .then(appPath => {
                  const downloadedApp = Object.assign(app, {
                    contentHash: definition.name,
                    localUrl: `file://${appPath}/index.html`,
                  });

                this.updateApp(downloadedApp);
                  return downloadedApp;
                })
                .catch(e => {
                  console.error(`Error loading dapp ${ext}`, e);
                });
            });
      }
      })
      .then((app) => {
        this.emit('loaded', app);
        return app;
      });
  }

  loadLocalApps () {
    return Promise
      .all([
        this.fetchBuiltinApps().then((apps) => this.addApps(apps)),
        this.fetchLocalApps().then((apps) => this.addApps(apps, true))
      ]);
  }

  loadAllApps () {
    return Promise
      .all([
        this.loadLocalApps(),
        this.fetchChaingearApps().then(apps => this.addApps(apps))
      ])
      .then(this.writeDisplayApps);
  }

  subscribeToChanges () {
    const { dappReg } = Contracts.get(this._api);

    // Unsubscribe from previous subscriptions, if any
    if (this._subscriptions.block) {
      this._api.unsubscribe(this._subscriptions.block);
    }

    if (this._subscriptions.filter) {
      this._api.eth.uninstallFilter(this._subscriptions.filter);
    }

    // Subscribe to dapps reg changes
    subscribeToChanges(this._api, dappReg, (appIds) => {
      const updates = appIds.map((appId) => {
        return this.fetchRegistryApp(dappReg, appId, true);
      });

      Promise
        .all(updates)
        .then((apps) => {
          this.addApps(apps);
        });
    }).then((subscriptions) => {
      this._subscriptions = subscriptions;
    });
  }

  fetchBuiltinApps (force = false) {
    if (!force && this._cachedApps[BUILTIN_APPS_KEY] !== undefined) {
      return Promise.resolve(this._cachedApps[BUILTIN_APPS_KEY]);
    }

    this._cachedApps[BUILTIN_APPS_KEY] = fetchBuiltinApps()
      .then((apps) => {
        this._cachedApps[BUILTIN_APPS_KEY] = apps;
        return apps;
      });

    return Promise.resolve(this._cachedApps[BUILTIN_APPS_KEY]);
  }

  fetchLocalApps () {
    return fetchLocalApps();
  }

  fetchRegistryAppIds (force = false) {
    if (!force && this._registryAppsIds) {
      return Promise.resolve(this._registryAppsIds);
    }

    this._registryAppsIds = fetchRegistryAppIds(this._api)
      .then((appIds) => {
        this._registryAppsIds = appIds;
        return this._registryAppsIds;
      });

    return Promise.resolve(this._registryAppsIds);
  }

  fetchRegistryApp (dappReg, appId, force = false) {
    if (!force && this._cachedApps[appId] !== undefined) {
      return Promise.resolve(this._cachedApps[appId]);
    }

    this._cachedApps[appId] = fetchRegistryApp(this._api, dappReg, appId)
      .then((dapp) => {
        this._cachedApps[appId] = dapp;
        return dapp;
      });

    return Promise.resolve(this._cachedApps[appId]);
  }

  fetchChaingearApps () {
    return this.fetchChaingearAppIds()
      .then(ids => Promise.all(
        ids
          .filter(id => !this.getAppById(id))
          .map(id => this.fetchChaingerAppDefinitionById(id))
        )
      )
      .then(appDefArr => {
        return Promise.all(appDefArr.map(def => this.fetchChaingearApp(def)));
      });
  }

  fetchChaingearAppIds () {
    return new Promise(resolve => {
      const applications = this._api.newContract(entryCoreAbi, entryCoreContractAddr);

      applications.instance.entriesAmount.call().then(d => {
        const ids = range(0, d.toNumber());

        resolve(ids);
      });
    });
  }

  fetchChaingerAppDefinitionById (id) {
    return new Promise(resolve => {
      const applications = this._api.newContract(entryCoreAbi, entryCoreContractAddr);

      applications.instance.entryInfo.call({}, [id]).then(arr => {
        const obj = {
          name: arr[0],
          iconUrl: arr[1],
          contentUrl: arr[2],
          manifestUrl: arr[3],
          id
        };
        // console.log(' >> ', obj);
        resolve(obj);
      });
    });
  }

  fetchChaingearApp (appDefinition) {
    console.log('-> fetching app from chaingear: ', appDefinition.name);

    const app = this.getAppById(appDefinition.id.toString());
    if (app) {
      console.log('-> app already resolved, return definition: ', appDefinition.name);
      return Promise.resolve(app);
    }

    return HashFetch.get().downloadAppIconAndManifest(appDefinition).then((appPath) => {
      const manifestPath = path.join(appPath, 'manifest.json');

      return fsReadFile(manifestPath)
        .then(manifestJson => JSON.parse(manifestJson))
        .then(manifest => {
          const { author, description, name, version } = manifest;
          // console.log( ' appDefinition ', appDefinition)
          return {
            author: author,
            ext: appDefinition.name,
            description: description,
            id: '' + appDefinition.name,
            chaingearId: appDefinition.id,
            image: `file://${appPath}/icon.png`,
            name: name,
            type: 'network',
            version: version,
            visible: true
          };
        });
    }).catch(e => {
      console.log('-> cannot fetch app from chaingear error ->', e);
    });
  }

  fetchRegistryApps (dappReg) {
    return this
      .fetchRegistryAppIds()
      .then((appIds) => {
        const promises = appIds.map((appId) => {
          // Fetch the Dapp and display it ASAP
          return this
            .fetchRegistryApp(dappReg, appId)
            .then((app) => {
              if (app) {
                this.addApps([app]);
              }

              return app;
            });
        });

        return Promise.all(promises);
      })
      .then(apps =>
        apps.filter(app => app));
  }

  @action refreshDapps = () => {
    const self = this;

    self._api.parity.dappsRefresh()
      .then((res) => {
        if (res === true) {
          self.loadAllApps();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  @action openModal = () => {
    this.modalOpen = true;
  }

  @action closeModal = () => {
    this.modalOpen = false;
  }

  @action closeExternalOverlay = () => {
    this.externalOverlayVisible = false;
    store.set(LS_KEY_EXTERNAL_ACCEPT, true);
  }

  @action loadExternalOverlay () {
    this.externalOverlayVisible = !(store.get(LS_KEY_EXTERNAL_ACCEPT) || false);
  }

  @action hideApp = (id) => {
    this.setDisplayApps({ [id]: { ...this.displayApps[id], visible: false, pinned: false } }); // Unpin app when we hide it
    this.writeDisplayApps();
  }

  @action showApp = (id) => {
    this.setDisplayApps({ [id]: { ...this.displayApps[id], visible: true } });
    this.writeDisplayApps();
  }

  @action pinApp = (id) => {
    this.setDisplayApps({ [id]: { ...this.displayApps[id], visible: true, pinned: true } }); // Make app visible when pinning it (should already be)
    this.writeDisplayApps();
  }

  @action unpinApp = (id) => {
    this.setDisplayApps({ [id]: { ...this.displayApps[id], pinned: false } });
    this.writeDisplayApps();
  }

  @action readDisplayApps = () => {
    const visibility = store.get(LS_KEY_DISPLAY) || {};

    // FIXME Very Ugly
    // Right now we hardcode so that the wallet and the Browse Dapps dapp are
    // pinned by default when the user launches for the first time.
    // TODO Find a way to make this cleaner. -Amaury 12/12/2017
    const WALLET_ID = 'v1';
    const DAPP_DAPP_VISIBLE_ID = '0xa48bd8fd56c90c899135281967a6cf90865c221b46f27f9fbe2a236d74a64ea2';

    if (!visibility[WALLET_ID] || visibility[WALLET_ID].pinned === undefined) {
      visibility[WALLET_ID] = { visible: true, pinned: true };
    }
    if (!visibility[DAPP_DAPP_VISIBLE_ID] || visibility[DAPP_DAPP_VISIBLE_ID].pinned === undefined) {
      visibility[DAPP_DAPP_VISIBLE_ID] = { visible: true, pinned: true };
    }

    this.displayApps = visibility;
  }

  @action writeDisplayApps = () => {
    store.set(LS_KEY_DISPLAY, this.displayApps);
  }

  @action setDisplayApps = (displayApps) => {
    this.displayApps = Object.assign({}, this.displayApps, displayApps);
  };

  @action updateApp = (appForUpdate) => {
    transaction(() => {
      this.apps = this.apps
        .filter((app) => app.id !== appForUpdate.id)
        .concat([appForUpdate]);
    });
  }

  @action addApps = (_apps = [], _local = false) => {
    transaction(() => {
      const builtinAppsIds = this.apps
        .filter((app) => app.id && app.type === 'builtin')
        .map((app) => app.id);

      // Disallow overwriting built-in dapps (ignore v1 served by Parity)
      const apps = _apps
        .filter((app) => app)
        .filter((app) => !app.id || !builtinAppsIds.includes(app.id));

      // Get new apps IDs if available
      const newAppsIds = apps
        .map((app) => app.id)
        .filter((id) => id);

      this.apps = this.apps
        .filter((app) => !app.id || !newAppsIds.includes(app.id))
        .filter((app) => !(app.type === 'local' && _local && apps.indexOf(app) === -1))
        .concat(apps || [])
        .sort((a, b) => a.name.localeCompare(b.name));

      const visibility = {};

      apps.forEach((app) => {
        if (!this.displayApps[app.id]) {
          visibility[app.id] = { visible: app.visible };
        }
      });

      this.setDisplayApps(visibility);
    });
  }

  getAppById = (id) => {
    return this.apps.find((app) => app.id === id);
  }
}

export {
  LS_KEY_DISPLAY
};
