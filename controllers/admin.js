const Product = require('../models/product');

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
  // Product.create({
  //   title,
  //   price,
  //   imageUrl,
  //   description,
  //   userId: req.user.id,
  // }).then(() => {
  //   console.log('successfully created a product')
  //   res.redirect('/admin/products');
  // }).catch(err => console.log(err));
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  const [product] = await req.user.getProducts({ where: { id: prodId } })
  console.log(product);
  if(!product) return res.redirect('/');
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: product
  });
  // Product.findByPk(prodId).then(product => {
  //   if (!product) {
  //     return res.redirect('/');
  //   }
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: product
  //   });
  // }).catch(err => console.error(err));
};

exports.postEditProduct = async (req, res, next) => {
  const {
    prodId,
    updatedTitle,
    updatedPrice,
    updatedImageUrl,
    updatedDesc,
  } = req.body;
  let updatedProduct = await Product.findByPk(prodId);
  updatedProduct.title = updatedTitle;
  updatedProduct.imageUrl = updatedImageUrl;
  updatedProduct.description = updatedDesc;
  updatedProduct.price = updatedPrice;
  await updatedProduct.save();
  return res.redirect('/admin/products');
};

exports.getProducts = async (req, res, next) => {
  const products = await req.user.getProducts()
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  // Product.destroy({where: {id: prodId} })
  const targetProd = await Product.findByPk(prodId);
  await targetProd.destroy();
  console.log('product destroyed');
  return res.redirect('/admin/products');
};
