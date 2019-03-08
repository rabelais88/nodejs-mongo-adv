const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie');
  console.log('session', req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: Boolean(req.session.isLoggedIn),
  });
};

exports.postLogin = async (req, res, next) => {
  if (!req.session.isLoggedIn) {
    const user = await User.findOne({ email: 'sungryeolp@gmail.com' });
    req.session.isLoggedIn = true;
    req.session.user = user;
  }
  // res.setHeader('Set-Cookie', 'HttpOnly');
  res.redirect('/');
};

exports.getLogout = async (req, res, next) => {
  await req.session.destroy();
  res.redirect('/');
};