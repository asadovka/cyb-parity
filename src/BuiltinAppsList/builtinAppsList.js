import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import List from 'semantic-ui-react/dist/commonjs/elements/List';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';

import styles from './builtinAppsList.css';
import AppListItem from './AppListItem/appListItem';
import {getUrl} from '../util/navigation';

@observer
class BuiltinAppsList extends Component {
  state = {
    isOpen: false
  };

  static propTypes = {
    appStore: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  handleOpen = () => {
    this.setState({ isOpen: true });
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  render () {
    const builtinApps = this.props.appStore.sortedBuiltin;

    const items = builtinApps.map((app) => {
      return <AppListItem
        onClick={ () => this.handleClose(app.id) }
        iconUrl={ app.image }
        to={ getUrl('cyb', app.id) }
        key={ app.id }
      >{app.name}</AppListItem>;
    });

    return (
      <Popup
        wide='very'
        className={ styles.popup }
        trigger={
          <div className={ styles.settings } />
        }
        content={
          <div>
            <List relaxed='very' selection className={ [styles.list, styles.accountsList].join(' ') } divided>
              { items }
            </List>
          </div>
        }
        offset={ 10 } // Empirically looks better
        on='click'
        hideOnScroll
        open={ this.state.isOpen }
        onClose={ this.handleClose }
        onOpen={ this.handleOpen }
        position='bottom right'
      />
    );
  }
}

export default BuiltinAppsList;
