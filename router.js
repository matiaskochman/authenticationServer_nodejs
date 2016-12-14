const AuthenticationController = require('./controller/authenticationController')
const PassportService = require('./services/PassportService');
const passport = require('passport');

// session false(not create a session with cookies)
const requireAuth = passport.authenticate('jwt',{session: false});
const requireSignIn = passport.authenticate('local', {session: false});

module.exports = function(app){
  app.get('/',requireAuth, function(req,res,next){
    res.send({hi: 'there'});
  });

  app.post('/signin', requireSignIn, AuthenticationController.signin);
  app.post('/signup', AuthenticationController.signup);
}
