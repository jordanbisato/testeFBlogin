var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var configAuth = require('./auth');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function(req, email, password, done) {
            process.nextTick(function() {
                User.findOne({ 'local.email':  email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
                    } else {
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function(req, email, password, done) {
            User.findOne({ 'local.email':  email }, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Wrong password.'));
                return done(null, user);
            });
        }));

    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'birthday', 'email', 'name', 'gender', 'picture'],
        },
        function(token, refreshToken, profile, done) {
            // process.nextTick(function() {
            //     User.findOne({ 'facebook.id': profile.id }, function(err, user) {
            //         if (err)
            //             return done(err);
            //         if (user) {
            //             return done(null, user);
            //         } else {
            //             var newUser = new User();
            //             newUser.facebook.id = profile.id;
            //             newUser.facebook.token = token;
            //             newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            //             newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
            //
            //             newUser.save(function(err) {
            //                 if (err)
            //                     throw err;
            //                 return done(null, newUser);
            //             });
            //         }
            //     });
            // });
            var retorno = {};
            retorno.facebook = profile;
            retorno.accessToken = token;
            return done(null, retorno);
        }));

    passport.use(new TwitterStrategy({
            consumerKey: configAuth.twitterAuth.consumerKey,
            consumerSecret: configAuth.twitterAuth.consumerSecret,
            callbackURL: configAuth.twitterAuth.callbackURL,
            userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
            includeEmail: true
        },
        function(token, tokenSecret, profile, done) {
            // process.nextTick(function() {
            //     User.findOne({ 'twitter.id': profile.id }, function(err, user) {
            //         if (err)
            //             return done(err);
            //         if (user) {
            //             return done(null, user);
            //         } else {
            //             var newUser = new User();
            //             newUser.twitter.id          = profile.id;
            //             newUser.twitter.token       = token;
            //             newUser.twitter.username    = profile.username;
            //             newUser.twitter.displayName = profile.displayName;
            //             newUser.save(function(err) {
            //                 if (err)
            //                     throw err;
            //                 return done(null, newUser);
            //             });
            //         }
            //     });
            // });
            var retorno = {};
            retorno.twitter = profile;
            retorno.accessToken = token;
            return done(null, retorno);
        }));

    passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
        },
        function(token, refreshToken, profile, done) {
            // process.nextTick(function() {
            //     User.findOne({ 'google.id': profile.id }, function(err, user) {
            //         if (err)
            //             return done(err);
            //         if (user) {
            //             return done(null, user);
            //         } else {
            //             var newUser = new User();
            //             newUser.google.id = profile.id;
            //             newUser.google.token = token;
            //             newUser.google.name = profile.displayName;
            //             newUser.google.email = profile.emails[0].value;
            //             newUser.save(function(err) {
            //                 if (err)
            //                     throw err;
            //                 return done(null, newUser);
            //             });
            //         }
            //     });
            // });
            var retorno = {};
            retorno.google = profile;
            retorno.accessToken = token;
            return done(null, retorno);
        }));
};