const express = require('express');
const router = express.Router();

// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');

// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');


// ===== CUSTOMER SIGNUP =====
router.post('/signup', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;

  const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

  if (dbCust) {
    res.json({ success: false, message: 'Exists username or email' });
  } 
  else {
    const now = new Date().getTime();
    const token = CryptoUtil.md5(now.toString());

    const newCust = {
      username: username,
      password: password,
      name: name,
      phone: phone,
      email: email,
      active: 0,
      token: token
    };

    const result = await CustomerDAO.insert(newCust);

    if (result) {
      const send = await EmailUtil.send(email, result._id, token);

      if (send) {
        res.json({ success: true, message: 'Please check email to activate account' });
      } 
      else {
        res.json({ success: false, message: 'Email sending failed' });
      }
    } 
    else {
      res.json({ success: false, message: 'Insert failure' });
    }
  }
});


// ===== CUSTOMER ACTIVE ACCOUNT =====
router.get('/active/:id/:token', async function (req, res) {
  const _id = req.params.id;
  const token = req.params.token;

  const customer = await CustomerDAO.selectByID(_id);

  if (customer && customer.token === token) {
    customer.active = 1;
    await CustomerDAO.update(customer);
    res.json({ success: true, message: 'Account activated successfully' });
  } 
  else {
    res.json({ success: false, message: 'Invalid activation link' });
  }
});


// ===== CUSTOMER LOGIN =====
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);

  if (customer) {
    if (customer.active === 1) {
      const token = JwtUtil.genToken({ _id: customer._id });
      res.json({ success: true, token: token, customer: customer });
    } 
    else {
      res.json({ success: false, message: 'Account not activated' });
    }
  } 
  else {
    res.json({ success: false, message: 'Incorrect username or password' });
  }
});


// ===== CUSTOMER UPDATE PROFILE =====
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;

  const customer = {
    _id: _id,
    username: username,
    password: password,
    name: name,
    phone: phone,
    email: email
  };

  const result = await CustomerDAO.update(customer);
  res.json(result);
});


// ===== CATEGORY =====
router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});


// ===== PRODUCT =====
router.get('/products/new', async function (req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});

router.get('/products/hot', async function (req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});


// products by category
router.get('/products/category/:cid', async function (req, res) {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});


// search products by keyword
router.get('/products/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});


// product by id
router.get('/products/:id', async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});


module.exports = router;