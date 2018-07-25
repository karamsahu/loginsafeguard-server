var express = require('express');
var router = express.Router();
var User = require('../models/user');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/register', function (req, res, next) {
  addUserToDb(req,res);
});

router.post('/login',function(req,res,next){

});

async function addUserToDb(req, res) {
  var user = new User({
    email: req.body.signupEmail,
    username: req.body.username,
    password: User.hashPassword(req.body.signupPassword),
    creationDate: Date.now()
  });

  try {
   var doc = await user.save();
   console.log(JSON.stringify(doc))
    return res.status(201).json(doc);
  }catch (err) {
    return res.status(501).json(err);
  }
}


module.exports = router;
