'use strict';

/**
 * auth/local provides routes for POST authentication.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/models').User;
var LocalStrategy = require('passport-local').Strategy;


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, fn) {
  fn(null, user._id);
});


// deserializeUser is passed a function that will return the user who
// belongs to an id.
passport.deserializeUser(function (id, fn) {
  User.findById(id, function (err, user) {
    fn(err, user);
  });
});

var isValidPassword = function(user, password){
  return password === user.password;
}


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function (username, password, fn) {
    User.findOne({'username': username}, function (err, usr) {
      if (err) {
        return fn(err, false, { message: 'An Error occured' });
      }
      // no user then an account was not found for that email address
      if (!usr) {
        return fn(null, false, { message: 'Unknown username ' + username });
      }
      // if the password is invalid return that 'Invalid Password' to
      // the user
      if (!isValidPassword(usr, password)) {
        return fn(null, false, { message: 'Invalid Password' });
      }
      return fn(null, usr);
    });
  }
));


router.post('/', 
  passport.authenticate('local', 
    { successRedirect: '/main',
    failureRedirect: '/login',
    failureFlash: true })
);



module.exports = router;