const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');
// const User = require('./models/user-custom'); // custom user

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
  const client = await new mongoConnect();
  // custom user
  // const user = new User('kim sungryeol', 'railguns@gmail');
  // await user.save();
  // console.log('user is', await User.findByEmail('railguns@gmail'));
  app.listen(port, () => {
    console.log(`app listening to ${port}`);
  });

})()

