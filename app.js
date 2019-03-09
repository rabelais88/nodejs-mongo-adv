const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const { dbid, pw } = require('./settings');
if (!dbid) throw 'db id is missing...check settings.js';
if (!pw) throw 'pw for db is missing...check settings.js';

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: `mongodb+srv://${dbid}:${pw}@cluster0-xuqfn.mongodb.net/shop`,
  collection: 'sessions'
});

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
// const cookieParser = require('cookie-parser'); // not necessary if session is used

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my secret',
  resave: false, // session will not be saved everytime
  saveUninitialized: false,
  store: store,
}));
app.use(async (req, res, next) => {
  if (req.session.isLoggedIn) {
    const user = await User.findOne({ email: req.session.user.email });
    // supposed to find for user by email / user data in session
    req.user = user;
  }
  next();
});
// app.use(cookieParser());

// the order of load is VERY important because this middleware has to be loaded FIRST -> next -> other middlewares
app.use(async (req, res, next) => {
  let user = await User.findOne({ email: 'sungryeolp@gmail.com' });
  console.log(user);
  if (!user) {
    console.log('user not found...creating new user');
    user = await new User({
      name: 'sungryeol',
      email: 'sungryeolp@gmail.com',
      cart: {
        items: [],
      },
    }).save();
  }
  req.user = user;
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// -------------------------------------------

const port = 3000;

(async() => {
  await mongoose.connect(`mongodb+srv://${dbid}:${pw}@cluster0-xuqfn.mongodb.net/shop?retryWrites=true`);
  console.log('connected to mongoose...');
  await app.listen(port);
  console.log(`app listening to ${port}`);
})()

