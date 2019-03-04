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
  const product = await new Product({ title, price, description, imageUrl }).save();
  console.log('successfully created a product');
  console.log(product);
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
  const updatedProduct = await new Product({
    id: new mongodb.ObjectId(productId), // important!
    title,
    price,
    imageUrl,
    description,
  }).save();
  console.log('updated finished', updatedProduct);
  return res.redirect('/admin/products');
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  // Product.destroy({where: {id: prodId} })
  const targetProd = await Product.deleteById(prodId);
  console.log('product destroyed');
  return res.redirect('/admin/products');
};
