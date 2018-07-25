var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
router.post('/register', function (req, res, next) {
  addUserToDb(req, res);
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
  } catch (err) {
    return res.status(501).json(err);
  }
}
//users route .js

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return res.status(501).json(err); }
    if (!user) {
      return res.status(400).json(info);
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      return res.status(200).json({ message: 'Login Successful' });
    });
  })(req, res, next);
});

router.get('/user', isLoggedIn, function(req, res, next){
  return res.status(200).json(req.user);
});

router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  return res.status(200).json({message: 'Logout successfull'});
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    next();
  }else{
   return  res.status(401).json({message: "Unauthorized request or Invalid session, relogin"});
  }
}


module.exports = router;
