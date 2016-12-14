const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user){
  const timestamp = new Date().getTime();

  return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}

exports.signin = function(req,res,next){
  // User has already had their email and password authenticated
  // we just need to give them a token

  // req.user ... in passportService ...localLogin .... return done(null,user);
  res.send({token: tokenForUser(req.user)});
}

exports.signup = function (req,res,next){
  const email = req.body.email;
  const password = req.body.password;

  // See if a user with a given email exists
  User.findOne({email: email},function(err,user){

    if(!email || !password){
      res.status(422).send({error: 'You must provide email and password'});
    }
    if(err){
      return next(err);
    }

    // If a user with email does exists, return an Error
    if(user){
      return res.status(422).send({error: 'Email in use'});
    }

    // If a user with email does NOT exists, create and save user
    const newUser = new User({
      email: email,
      password: password
    });

    newUser.save(function(err){
      if(err){
        return next(err);
      }
    });

    // Respond to request indicating the user was created.
    res.json({token: tokenForUser(newUser)});
  });



}
