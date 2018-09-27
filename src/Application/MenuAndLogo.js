import React, { Component } from 'react';
import {
  Menu,
  MenuItem,
  Logo,
  HamburgerMenu
} from '../components/MenuAndLogo/MenuAndLogo';
import builtinApps from '../Dapps/dappsBuiltin.json';
import { getBuildPath } from '../util/host';

class MenuAndLogo extends Component {
  state = {
    menuOpen: false
  }

    toggle = () => {
      this.setState({
        menuOpen: !this.state.menuOpen
      })
    }

    click = (e, url) => {
      e.preventDefault();
      this.props.search(url);
      this.setState({
        menuOpen: false
      })
    }

  render() {

    const {
      menuOpen
    } = this.state

    const {
      search
    } = this.props

    const onMenuItemClick = () => {
      this.setState({
        menuOpen: false
      });
    };

    const builtInAppsPath = getBuildPath();

    //debugger;
    const menuItems = builtinApps.map((app) => {

      // todo: get icon url from manifest?
      //const iconUrl = `file://${builtInAppsPath}/${app.id}/icon.png`;

      return <MenuItem
                onClick={ onMenuItemClick }
                icon='explorer'
                to={ `/${app.id}` }
                key={ app.id }
             >{app.name}</MenuItem>;
    });

    return (
      <div>
{/*        <HamburgerMenu open={menuOpen} onClick={this.toggle}>
          <Menu open={true} >
            { menuItems }
          </Menu>
        </HamburgerMenu>*/}
        <Logo to='/'>logo</Logo>
      </div>
    );
  }

}

export default MenuAndLogo;
