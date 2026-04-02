require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const OrderDAO = {
  // Hàm thêm đơn hàng mới
  async insert(order) {
    order._id = new mongoose.Types.ObjectId();
    const result = await Models.Order.create(order);
    return result;
  },

  // Hàm lấy danh sách đơn hàng theo Customer ID (cho khách hàng)
  async selectByCustID(_cid) {
    const query = { 'customer._id': _cid };
    const orders = await Models.Order.find(query).exec();
    return orders;
  },

  // Hàm lấy tất cả đơn hàng (cho Admin)
  async selectAll() {
    const query = {};
    const mysort = { cdate: -1 }; // Sắp xếp giảm dần theo ngày tạo
    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },

  // CẬP NHẬT: Hàm cập nhật trạng thái đơn hàng
  async update(_id, newStatus) {
    const newvalues = { status: newStatus };
    const result = await Models.Order.findByIdAndUpdate(_id, newvalues, { new: true });
    return result;
  }
};

module.exports = OrderDAO;