var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require('../models/users');

passport.serializeUser(function(User, done) {
    done(null, User.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, User) {
        done(err, User);
    });
});

passport.use('local-signup', new localStrategy(
            {usernameField: 'username', passwordField: 'password', passReqToCallback: true},
    function(req,username, password, done) {
        console.log('HERE2', username);
        console.log('HERE3', password);
        User.findOne({'username': username}, function(err, Userb) {
            if (err) return done(err);
            if (Userb) {
                console.log("HERE");
                return done(null, false);
            } else {
                var newUser = new User();
                newUser.username = username;
                newUser.email = req.body.email;
                newUser.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if (err) throw err;
                    else {
                        return done(null, newUser);
                    }
                });
            }
        });
    }
));

passport.use('local-login', new localStrategy(
    function(username, password, done) {
        User.findOne({'username' : username }, function(err, user) {
            if (err) return done(err);
            //User does not exist
            else if (!user) return done(null, false);
            //Wrong password
            else if (!user.validPassword(password)) return done(null, false);
            //Life is great
            else return done(null, user);
        });
    }
));

module.exports = function(app) {
    app.passport = passport;
    app.use(passport.initialize());
    app.use(passport.session());
};
