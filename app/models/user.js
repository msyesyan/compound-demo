module.exports = function (compound, User) {
  var bcrypt = require('bcrypt');

  User.afterInitialize = function() {
    this.password = null;
    this.password_confirmation = null;
  };

  User.validatesPresenceOf('email');
  User.validatesUniquenessOf('email');
  //validates password==password_confirmation
  //validates password length

  User.beforeSave = function(next) {
    if (this.password) {
      this.encryptPassword();
    }

    this.updated_at = new Date;
    next();
  }

  User.verifyPassword = function(password, encrypt_password) {
    return bcrypt.compareSync(password, encrypt_password);
  }

  User.prototype.encryptPassword = function() {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(this.password, salt);
    this.encrypt_password = hash;
  }
};