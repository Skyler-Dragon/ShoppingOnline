import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Menu extends Component {
  static contextType = MyContext;

  render() {
    return (
      <div className="border-bottom">
        <div className="float-left">
          <ul className="menu">
            <li className="menu">
              <Link to="/admin/home">Home</Link>
            </li>

            <li className="menu">
              <Link to="/admin/category">Category</Link>
            </li>

            <li className="menu">
              <Link to="/admin/product">Product</Link>
            </li>

            <li className="menu">
              <a href="">Order</a>
            </li>

            <li className="menu">
              <a href="">Customer</a>
            </li>
          </ul>
        </div>

        <div className="float-right">
          Hello <b>{this.context.username}</b> |{' '}
          <a href="" onClick={this.lnkLogoutClick}>
            Logout
          </a>
        </div>

        <div className="float-clear"></div>
      </div>
    );
  }

  // event handler
  lnkLogoutClick = (e) => {
    e.preventDefault();
    this.context.setToken('');
    this.context.setUsername('');
  };
}

export default Menu;
