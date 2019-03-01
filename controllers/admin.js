const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title,
    price,
    imageUrl,
    description
  }).then(() => {
    console.log('successfully created a product')
    res.redirect('/admin/products');
  }).catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  }).catch(err => console.error(err));
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  let updatedProduct = await Product.findByPk(prodId);
  updatedProduct.title = updatedTitle;
  updatedProduct.imageUrl = updatedImageUrl;
  updatedProduct.description = updatedDesc;
  updatedProduct.price = updatedPrice;
  await updatedProduct.save();
  return res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.error(err));
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  // Product.destroy({where: {id: prodId} })
  const targetProd = await Product.findByPk(prodId);
  await targetProd.destroy();
  console.log('product destroyed');
  return res.redirect('/admin/products');
};
