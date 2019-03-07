exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie');
  console.log('cookies', req.cookies);
  console.log('session', req.session);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: Boolean(req.cookies.loggedIn),
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
  res.redirect('/');
};