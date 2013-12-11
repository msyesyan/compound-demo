var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

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

    compound.app.post('/login', passport.authenticate('local', {
        failureRedirect: '/users/login',
        failureFlash: 'error'
    }), redirectOnSuccess);
    
    function callback(email, password, done) {
        compound.models.User.findOne({where: { email: email }}, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(err, false);
            }
            if (!compound.models.User.verifyPassword(password, user.encrypt_password)) {
              return done(err, false);
            } else {
              return done(err, user);
            }
        });
    }

    function redirectOnSuccess(req, res) {
        var redir = '/';
        if (req.session.redirect) {
            redir = req.session.redirect;
            delete req.session.redirect;
        }
        res.redirect(redir);
    }
}