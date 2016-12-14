const User = require('../models/user');

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
    res.json({success: true});
  });



}
