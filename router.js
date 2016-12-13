const Authentication = require('./controller/authenticationController')

module.exports = function(app){
  app.get('/',function(req,res,next){
    res.send(['waterbottle','phone','paper']);
  });

  app.post('/signup', Authentication.signup);
}
