import React, { Component } from 'react';
import {
  Menu,
  MenuItem,
  Logo,
  HamburgerMenu
} from '../components/MenuAndLogo/MenuAndLogo';
import builtinApps from '../Dapps/dappsBuiltin.json';

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
      })
    }

    return (
      <div>
        <HamburgerMenu open={menuOpen} onClick={this.toggle}>
          <Menu open={true} >
            {
              builtinApps.map((app) => {
                return <MenuItem onClick={ onMenuItemClick } icon='explorer' to={ `/${app.id}` } key={ app.id }>{app.name}</MenuItem>;
              })
            }
          </Menu>
        </HamburgerMenu>
        <Logo to='/'>logo</Logo>
      </div>
    );
  }

}

export default MenuAndLogo;
