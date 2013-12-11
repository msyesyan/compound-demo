var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(compound) {
  compound.passport = passport;

  passport.use(new LocalStrategy({
    usernameField: 'email',
  }, callback));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (userId, done) {
    compound.models.User.find(userId, function (err, user) {
      done(err, user);
    });
  });

  compound.app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (info) {
      req.session.messages = [info.message];
    }
    console.log('message====>', req.session.messages)
    if (!user) {
      return res.redirect('/users/login')
    }
    req.logIn(user, function(err) {
      if (err) { 
        return next(err);
      }
      var redir = "/";
      if (req.session.redirect) {
        redir = req.session.redirect;
        delete req.session.redirect;
      }
      res.redirect(redir);
    });
    })(req, res, next);
  });

  compound.app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
  
  function callback(email, password, done) {
    compound.models.User.findOne({where: { email: email }}, function(err, user) {
      if (err) { return done(err); }
      if (!(user && compound.models.User.verifyPassword(password, user.encrypt_password))) {
        return done(err, false, {message: 'email or password invalid'});
      } else {
        return done(err, user, {message: 'login successful'});
      }
    });
  }
}