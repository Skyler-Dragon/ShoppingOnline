import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      itemSelected: null,
      curPage: 1,
      noPages: 0
    };
  }

  render() {
    const rows = this.state.products.map((item) => {
      return (
        <tr
          key={item._id}
          className="datatable"
          onClick={() => this.trItemClick(item)}
        >
          <td>{item._id}</td>
          <td>{item.name}</td>
          <td>{item.price}</td>
          <td>
            <img src={item.image} width="50" alt="" />
          </td>
          <td>{new Date(item.cdate).toLocaleDateString()}</td>
          <td>{item.category.name}</td>
        </tr>
      );
    });

    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">PRODUCT LIST</h2>

          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Image</th>
                <th>Create date</th>
                <th>Category</th>
              </tr>
              {rows}
            </tbody>
          </table>

          <div className="text-center">
            {this.renderPaging()}
          </div>
        </div>

        <div className="inline" />

        <ProductDetail
          item={this.state.itemSelected}
          curPage={this.state.curPage}
          updateProducts={this.updateProducts}
        />

        <div className="float-clear" />
      </div>
    );
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  // ================= EVENT HANDLERS =================
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  lnkPageClick(page) {
    this.setState({ curPage: page });
    this.apiGetProducts(page);
  }

  // ================= PAGING =================
  renderPaging() {
    const pages = [];
    for (let i = 1; i <= this.state.noPages; i++) {
      pages.push(
        <span
          key={i}
          className="link"
          onClick={() => this.lnkPageClick(i)}
        >
          {i}&nbsp;
        </span>
      );
    }
    return pages;
  }

  // ================= UPDATE FROM CHILD =================
  updateProducts = (products, noPages) => {
    this.setState({ products: products, noPages: noPages });
  };

  // ================= API =================
  apiGetProducts(page) {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .get('/api/admin/products?page=' + page, config)
      .then((res) => {
        const result = res.data;
        this.setState({
          products: result.products,
          noPages: result.noPages,
          curPage: result.curPage
        });
      });
  }
}

export default Product;
