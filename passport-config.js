var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user')
//local strategy assumes that username and password fields are the fields that require to be authenticated
// loginEmail:"karamsahu@gmail.com"
// loginPassword:"a"
passport.use('local', new LocalStrategy({
    usernameField: 'loginEmail',
    passwordField: 'loginPassword'
},
    function (username, password, done) {
        User.findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.isValidPassword(password)) {
                if (user.loginAttempts < 2) {
                    var newUser = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        password: user.password,
                        creationDate: Date.now(),
                        loginAttempts: user.loginAttempts + 1,
                        isLocked: user.isLocked
                    }
                    User.findOneAndUpdate({ _id: user.id }, newUser,  {upsert: true}, function (err, user) {
                        if (user) {
                            return done(null, false, { message: 'Incorrect password.' });
                        }else{
                            return done(null, user);
                        }
                    });
                }
            }
             return done(null, user);
        });
    }
));


passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});