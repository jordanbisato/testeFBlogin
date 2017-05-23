var express           =     require('express')
  , passport          =     require('passport')
  , util              =     require('util')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('./configuration/config')
  , mysql             =     require('mysql')
  , app               =     express();

//Define MySQL parameter in Config.js file.
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

var i = 0;

//Connect to Database only if Config.js parameter is set.

if(config.use_database==='true')
{
    connection.connect();
}

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the FacebookStrategy within Passport.

passport.use(new FacebookStrategy({
      clientID: config.facebook_api_key,
      clientSecret:config.facebook_api_secret ,
      callbackURL: config.callback_url,
      profileFields: ['id', 'birthday', 'first_name', 'last_name', 'gender', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      if(config.use_database==='true')
      {
      connection.query("SELECT * from user_info where user_id="+profile.id,function(err,rows,fields){
        if(err) throw err;
        if(rows.length===0)
          {
            console.log("There is no such user, adding now");
            connection.query("INSERT into user_info(user_id,user_name) VALUES('"+profile.id+"','"+profile.username+"')");
          }
          else
            {
              console.log("User already exists in database");
            }
          });
      }
        console.log("fbstrategy: " + i);
        i++;
        var retorno = {};
        retorno.profile = profile;
        retorno.accessToken = accessToken;
      return done(null, retorno);
    });
  }
));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.get('/login-fb', function(req, res){
    console.log("get index" + i);
    i++;
  res.render('index', { user: req.user });
});

app.get('/login-fb/account', ensureAuthenticated, function(req, res){
    console.log("get account: " + i);
    i++;
    console.dir(req);
  res.render('account', { user: req.user });
});

app.locals.chamaJS = function(user) {
    var birthDate = "";
    console.log("ENTROU CHAMAJS");
    FacebookLogin.userProfile(user._json.first_name, user._json.last_name,
        user._json.email, user._json.gender, user._json.age_range.min, birthDate);
};

app.locals.shareBtn = function(accessToken, id) {

    const postTextOptions = {
        method: 'POST',
        uri: 'https://graph.facebook.com/v2.9/${id}/feed',
        qs: {
            access_token: accessToken,
            message: 'Hello world!'
        }
    };
    var res = request(postTextOptions);
    console.log("res: " + JSON.stringify(res));
};

app.get('/login-fb/auth/facebook', passport.authenticate('facebook',{scope:'email, public_profile'}));

app.get('/login-fb/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/login-fb/account', failureRedirect: '/login-fb/falhou' }),
  function(req, res) {
    res.redirect('/login-fb/account');
  });

app.get('/login-fb/logout', function(req, res){
  req.logout();
  res.redirect('/login-fb/');
});


function ensureAuthenticated(req, res, next) {
    console.log("ensure auth: " + i);
    i++;
  console.log("USER AUTH");
  console.dir(req.user);
  if (req.isAuthenticated()) { console.log("IS AUTH"); return next(); }
    console.log("NOT AUTH");
  res.redirect('/login-fb/')
}

app.listen(8085);
