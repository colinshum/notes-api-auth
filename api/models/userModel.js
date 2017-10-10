'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  user_class: {
    type: String,
    enum: ['general', 'instructor', 'admin'],
    default: 'general'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(pass, res) {
    bcrypt.compare(pass, this.password, function(err, isMatch) {
        if (err) return res(err);
        res(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
