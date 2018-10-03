import React, { Component } from 'react';
import { Settings, Wallet } from '../components/IdBar/IdBar';

import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import DefaultAccount from '../Status/DefaultAccount';
import AccountStore from '../ParityBar/accountStore';
import SignerPending from '../Status/SignerPending';
import appStore from '../Dapps/store';

import styles from './IdBar.css';
import builtinApps from '../Dapps/dappsBuiltin.json';
import BuiltinAppsList from '../BuiltinAppsList/builtinAppsList';
import { getUrl } from '../util/navigation';

const walletApp = builtinApps.find(app => app.name === 'Parity Wallet');

@observer
export default class IdBar extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  };

  static propTypes = {
    className: PropTypes.string,
    upgradeStore: PropTypes.object.isRequired
  };

  state = {
    menuOpen: false
  };

  toggle = () => {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  };

  render () {
    const accountStore = AccountStore.get(this.context.api);
    const store = appStore.get(this.context.api);

    return (
      <div className={ styles.container }>

        <BuiltinAppsList appStore={ store } />
        <SignerPending className={ styles.pending } />
        <Wallet to={ `${walletApp.ext}` } />
        <div className={ styles.defaultAccount }>
          <DefaultAccount accountStore={ accountStore } />
        </div>

      </div>
    );
  }
}
