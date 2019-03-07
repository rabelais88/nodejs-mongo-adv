const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = await new Product({ title, price, description, imageUrl, userId: req.user }).save();
  console.log('successfully created a product');
  res.redirect('/admin/products');
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  if(!product) return res.redirect('/');
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: product
  });
};

exports.postEditProduct = async (req, res, next) => {
  console.log('edit requested', req.body);
  const {
    productId,
    title,
    price,
    description,
    imageUrl,
  } = req.body;
  const updatedProduct = await Product.findById(productId);
  updatedProduct.title = title;
  updatedProduct.price = price;
  updatedProduct.description = description;
  updatedProduct.imageUrl = imageUrl;
  const result = await updatedProduct.save();
  console.log('updated finished', result);
  return res.redirect('/admin/products');
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.find().populate('userId');
  console.log('admin items', products);
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const targetProd = await Product.findByIdAndRemove(prodId);
  console.log('product destroyed');
  return res.redirect('/admin/products');
};
