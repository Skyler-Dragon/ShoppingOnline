import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';

import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import Product from './ProductComponent';
import Category from './CategoryComponent';

class Main extends Component {
  static contextType = MyContext; // dùng this.context để truy cập global state

  render() {
    if (this.context.token !== '') {
      return (
        <div className="body-admin">
          <Menu />

          <Routes>
            <Route path="/admin/home" element={<Home />} />
            <Route path="/admin/product" element={<Product />} />
            <Route path="/admin/category" element={<Category />} />
          </Routes>

        </div>
      );
    }
    return <div />;
  }
}

export default Main;
