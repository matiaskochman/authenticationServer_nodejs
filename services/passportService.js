const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


// Create local Strategy
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions,function(email,password,done){
// Verify this email and password, call done with the user
// if it's correct email and password
// otherwise, call done with false

  User.findOne({email: email},function(err,user){
    if(err){
      return done(err);
    }
    if(!user){
      return done(null,false);
    }

    // compare passwords - is 'password' equal to user.password
    user.comparePassword(password, function(err,isMatch){
      if(err){
        return done(err);
      }

      if(!isMatch){
        return done(null,false);
      }

      return done(null,user);
    })
  })
})

// Setup options for JwtStrategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};


// Create JwtStrategy
const jwtLogin = new JwtStrategy(jwtOptions,function(payload,done){
    // See if the user ID of the payload exists in our database
    // If it exists, call 'done' with that user.
    // otherwise, call 'done' without a user object.
    User.findById(payload.sub,function(err,user){
      if(err){
        return done(err,false);
      }

      if(user){
        return done(null,user);
      }else{
        return done(null,false);
      }
    });
});

// Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);
