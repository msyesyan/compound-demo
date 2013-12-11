before('protect from forgery', function () {
  protectFromForgery('f809c04912824c9c14236c0913445bf565d8cc40');
});

before('currentUser', function() {
  currentUser = session.passport.user;
  next();
})