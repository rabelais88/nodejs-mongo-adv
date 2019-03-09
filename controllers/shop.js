const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All products',
    path: '/products',
    isAuthenticated: Boolean(req.session.isLoggedIn)
  });
  return ;
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  res.render('shop/product-detail', {
    product: product,
    pageTitle: product.title,
    path: '/products',
    isAuthenticated: Boolean(req.session.isLoggedIn)
  });
  return true;
};

exports.getIndex = async (req, res, next) => {
  const products = await Product.find();
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    isAuthenticated: Boolean(req.session.isLoggedIn)
  });
  return true;
};

exports.getCart = async (req, res, next) => {
  const user = await req.user.populate('cart.items.productId').execPopulate();
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: user.cart.items.map(el => {
      el.productId.quantity = el.quantity;
      return el.productId;
    }),
    isAuthenticated: Boolean(req.session.isLoggedIn)
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
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders,
    isAuthenticated: Boolean(req.session.isLoggedIn)
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isAuthenticated: Boolean(req.session.isLoggedIn)
  });
};

exports.postOrder = async (req, res, next) => {
  let products = await req.user.populate('cart.items.productId').execPopulate();
  products = products.cart.items.map(i => ({
    quantity: i.quantity,
    product: { ...i.productId._doc },
  }))
  const order = new Order({
    user: {
      name: req.session.user.name,
      userId: req.session.user,
    },
    products
  });
  await order.save();
  res.redirect('/orders');
};