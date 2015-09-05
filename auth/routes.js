'use strict';

/**
 * auth/local provides routes for POST authentication.
 */

var passport = require('passport');
var User = require('../users/models').User;
var LocalStrategy = require('passport-local').Strategy;
var ibmdb = require('ibm_db');


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, fn) {
  fn(null, user.id);
});


// deserializeUser is passed a function that will return the user who
// belongs to an id.
passport.deserializeUser(function (id, fn) {
  User.findOne({_id: id}, function (err, user) {
    fn(err, user);
  });
});


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
        return fn(err, false, { message: 'Unknown username ' + username });
      }
      // If we have a user lets compare the provided password with the
      // user's passwordHash
      User.comparePasswordAndHash(password, usr.passwordHash, function (err, valid) {
        if (err) {
          return fn(err);
        }
        // if the passoword is invalid return that 'Invalid Password' to
        // the user
        if (!valid) {
          return fn(null, false, { message: 'Invalid Password' });
        }
        return fn(err, usr);
      });
    });
  }
));


// POST */auth/local
exports.local = function (req, res, fn) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return fn(err);
    }
    if (!user) {
      return res.redirect('/login');
    }

    req.logIn(user, function (err) {
      if (err) {
        return fn(err);
      }
      return res.redirect('/mentee-dashboard');
    });
  })(req, res, fn);
};