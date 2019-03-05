const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const { user, pw } = require('./settings');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// the order of load is VERY important because this middleware has to be loaded FIRST -> next -> other middlewares
// app.use(async (req, res, next) => {
//   const user = await User.findByEmail('sungryeolp@gmail.com');
//   if (user) {
//     req.user = new User(user.name, user.email, user.cart, user._id);
//   } else {
//     await new User('sungryeol park', 'sungryeolp@gmail.com', { items: [] }).save();
//     let tmpUser = await User.findByEmail('sungryeolp@gmail.com')
//     req.user = new User(tmpUser.name, tmpUser.email);
//   }
//   next();
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// -------------------------------------------

const port = 3000;

(async() => {
  await mongoose.connect(`mongodb+srv://${user}:${pw}@cluster0-xuqfn.mongodb.net/shop?retryWrites=true`);
  console.log('connected to mongoose...');
  await app.listen(port);
  console.log(`app listening to ${port}`);
})()

