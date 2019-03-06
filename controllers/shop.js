const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  console.log(products);
  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All products',
    path: '/products'
  });
  return true;
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId)
  console.log('product requested', prodId);
  res.render('shop/product-detail', {
    product: product,
    pageTitle: product.title,
    path: '/products'
  });
  return true;
};

exports.getIndex = async (req, res, next) => {
  const products = await Product.find();
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/'
  });
  return true;
};

exports.getCart = async (req, res, next) => {
  const user = await req.user.populate('cart.items.productId').execPopulate();
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: user.cart.items.map(el => el.productId),
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const product = await Product.findById(prodId);
  await req.user.addToCart(product);
  res.redirect('/cart');
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  await req.user.removeFromCart(prodId);
  res.redirect('/cart');
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders();
  console.log(orders);
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postOrder = async (req, res, next) => {
  await req.user.addOrder()
  res.redirect('/orders');
};