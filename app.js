const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// the order of load is VERY important because this middleware has to be loaded FIRST -> next -> other middlewares
app.use(async (req, res, next) => {
  // console.log('user data found', me);
  // req.user = me; // IMPORTANT
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// -------------------------------------------

const port = 3000;

(async() => {
  // const connStat = await sequelize.sync({ force: false })
  // // console.log(connStat)
  // // .sync({
  // //   force: true // warning: only for dev -- this may overwrite existing table with new scheme
  // // })
  // let me = await User.findById(1)
  // if (!me) me = await User.create({ name: 'Max', email: 'test@test.com' });
  // const carts = await Cart.findAll({ where: { userId: me.id }});
  // if (carts.length < 1) await me.createCart();
  // // console.log(me)
  const client = await new mongoConnect();
  const user = new User('kim sungryeol', 'railguns@gmail');
  await user.save();
  console.log('user is', await User.findByEmail('railguns@gmail'));
  app.listen(port, () => {
    console.log(`app listening to ${port}`);
  });

})()

