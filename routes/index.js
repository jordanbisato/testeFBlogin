var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/login-promo', function(req, res, next) {
    res.render('index.ejs', { title: 'Express' });
});

router.get('/login-promo/login', function(req, res, next) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/login-promo/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.get('/login-promo/profile', isLoggedIn, function(req, res) {
    console.log("user: " + JSON.stringify(req.user));
    res.render('profile.ejs', { user: req.user });
});

router.get('/login-promo/logout', function(req, res) {
    req.logout();
    res.redirect('/login-promo');
});

router.post('/login-promo/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
}));

router.post('/login-promo/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
}));

// Facebook routes
router.get('/login-promo/auth/facebook', passport.authenticate('facebook', {scope:'email, public_profile, publish_actions, user_posts'}));

router.get('/login-promo/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/login-promo/profile',
    failureRedirect: '/login-promo',
}));

// Twitter routes
router.get('/login-promo/auth/twitter', passport.authenticate('twitter', { scope: ['email'] }));

router.get('/login-promo/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/login-promo/profile',
    failureRedirect: '/login-promo',
}));

// Google routes
router.get('/login-promo/auth/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read', 'https://www.googleapis.com/auth/userinfo.profile'] }));

router.get('/login-promo/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/login-promo/profile',
    failureRedirect: 'login-promo/',
}));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("IS AUTH");
        return next();
    }
    console.log("NOT AUTH");
    res.redirect('/login-promo');
}