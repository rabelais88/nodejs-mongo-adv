const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

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

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }) //chaining Foreign key between two different models
// this creates fk under camel cased name. => adds .userId property to Product
User.hasMany(Product); // optional

const port = 3000;

(async() => {
  const connStat = await sequelize.sync()
  // console.log(connStat)
  // .sync({
  //   force: true // warning: only for dev -- this may overwrite existing table with new scheme
  // })
  let me = await User.findById(1)
  if (!me) me = await User.create({ name: 'Max', email: 'test@test.com' })
  console.log(me)
  app.listen(port, () => {
    console.log(`app listening to ${port}`);
  });

})()