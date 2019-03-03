const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// db.execute('SELECT * FROM products')
//   .then(res => {
//     // console.log(res)
//   })
//   .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// the order of load is VERY important because this middleware has to be loaded FIRST -> next -> other middlewares
app.use(async (req, res, next) => {
  // when any request is given, check user
  const me = await User.findByPk(1)
  // console.log('user data found', me);
  req.user = me; // IMPORTANT
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }) //chaining Foreign key between two different models

// db associations ----------------------------
// this creates fk under camel cased name. => adds .userId property to Product
User.hasMany(Product); // optional - add UserKey to Products - for admin
User.hasOne(Cart); // add UserKey to Cart

Cart.belongsTo(User); // add CartKey to User
Cart.hasMany(CartItem); // add CartKey to CartItem
Cart.belongsToMany(Product, { through: CartItem }); // adds productId to cartItem & creates methods - a single cart can hold multiple products - where this relation is stored? cartItem
Product.belongsToMany(Cart, { through: CartItem }); // adds cartId to cartItem & creates methods- a single product can be in many carts
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// -------------------------------------------

const port = 3000;

(async() => {
  const connStat = await sequelize.sync({ force: false })
  // console.log(connStat)
  // .sync({
  //   force: true // warning: only for dev -- this may overwrite existing table with new scheme
  // })
  let me = await User.findById(1)
  if (!me) me = await User.create({ name: 'Max', email: 'test@test.com' });
  const carts = await Cart.findAll({ where: { userId: me.id }});
  if (carts.length < 1) await me.createCart();
  // console.log(me)
  app.listen(port, () => {
    console.log(`app listening to ${port}`);
  });

})()

