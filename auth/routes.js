'use strict';

/**
 * auth/local provides routes for POST authentication.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/models').User;
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');


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
//   with a user object.  
passport.use('login', new LocalStrategy(function (username, password, fn) {
    console.log("inside login fn");
    User.findOne({'username': username}, function (err, usr) {
      if (err) {
        console.log(err);
        return fn(err, false, { message: 'An Error occured' });
      }
      // no user then an account was not found for that email address
      if (!usr) {
        console.log("No user");
        return fn(null, false, { message: 'Unknown username ' + username });
      }
      // if the password is invalid return that 'Invalid Password' to
      // the user
      if (!isValidPassword(usr, password)) {
        console.log("Invalid password");
        return fn(null, false, { message: 'Invalid Password' });
      }
      return fn(null, usr);
    });
  }));

passport.use('signup_student', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    console.log('MU LA LA');
    var findOrCreateUser = function(){
      // find a user in Mongo with provided username
      User.findOne({'username':username},function(err, user) {
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false, 
             req.flash('message','User Already Exists'));
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          router.use(bodyParser.json());
          newUser.username = username;
          newUser.password = password;

          newUser.fullname= req.body.fullname;
          newUser.agegroup = req.body.agegroup;
          newUser.school= req.body.school;

          console.log('HERE');  
 
          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log('User Registration succesful');    
            return done(null, newUser);
          })
        }
      });
    };
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  })
);


router.post('/login', 
  passport.authenticate('login', 
    { successRedirect: '/main',
    failureRedirect: '/login',
    failureFlash: false })
);

router.post('/signup/student', passport.authenticate('signup_student',
  {successRedirect: '/main',
  failureRedirect: '/signup/student',
  failureFlash: false})
);

router.post('/signup/college', passport.authenticate('local',
  {successRedirect: '/main',
  failureRedirect: '/signup/college',
  failureFlash: false})
  );



module.exports = router;