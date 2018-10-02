import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Image from 'semantic-ui-react/dist/commonjs/elements/Image';
import List from 'semantic-ui-react/dist/commonjs/elements/List';
import styles from './appListItem.css';
import Link from 'react-router/es/Link';

class AppListItem extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    iconUrl: PropTypes.string,
    children: PropTypes.string,
    to: PropTypes.string
  };

  render () {
    return (
      <List.Item
        onClick={this.props.onClick}
        disabled={false}
      >
        <Link to={this.props.to} classNmae={ styles.link }>
          <Image avatar>
            <div className={styles.avatarWrapper}>
              <img src={this.props.iconUrl}/>
            </div>
          </Image>
          <List.Content className={ styles.listContent }>
            <List.Header>
              {this.props.children}
            </List.Header>
          </List.Content>
        </Link>
      </List.Item>
    );
  }
}

export default AppListItem;
