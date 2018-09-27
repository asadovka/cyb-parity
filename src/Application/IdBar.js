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
import { HamburgerMenu, Menu, MenuItem } from '../components/MenuAndLogo/MenuAndLogo';
const walletApp = builtinApps.find(app => app.name === 'Parity Wallet');
const settingsApp = builtinApps.find(app => app.name === 'Node Status');

//({ className = '', upgradeStore }, { api })
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
    menuOpen: true
  };

  toggle = () => {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  };

  onMenuItemClick = () => {
    this.setState({
      menuOpen: false
    });
  };

  render () {
    const accountStore = AccountStore.get(this.context.api);
    const store = appStore.get(this.context.api);

    const menuItems = builtinApps.map((app) => {
      return <MenuItem
        onClick={ this.onMenuItemClick }
        icon=''
        to={ `/${app.id}` }
        key={ app.id }
      >{app.name}</MenuItem>;
    });

    return (
      <div className={ styles.container }>
        <Settings to={ `/${settingsApp.id}` } />

{/*        <HamburgerMenu open={ this.menuOpen } onClick={ this.toggle }>
          <Menu>
            {menuItems}
          </Menu>
        </HamburgerMenu>*/}

        <SignerPending className={ styles.pending } />
        <Wallet to={ `/${walletApp.id}` } />
        <div className={ styles.defaultAccount }>
          <DefaultAccount accountStore={ accountStore } />
        </div>
      </div>
    );
  }
}
