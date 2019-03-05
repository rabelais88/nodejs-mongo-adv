const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();
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
  const products = await Product.fetchAll()
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/'
  });
  return true;
};

exports.getCart = async (req, res, next) => {
  const cart = await req.user.getCart();
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: cart
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
  await req.user.deleteItemFromCart(prodId);
  res.redirect('/cart');
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders({ include: ['products']});
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
  const cart = await req.user.getCart();
  const products = await cart.getProducts();
  const order = await req.user.createOrder();
  const addResult = await order.addProducts(products.map(product => {
    product.orderItem = { quantity: product.cartItem.quantity };
    return product;
  }));
  await cart.setProducts(null);
  res.redirect('/orders');
  console.log(products);
};