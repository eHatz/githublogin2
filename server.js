var GitHubStrategy = require('passport-github').Strategy;
var passport = require('passport');
var express = require('express');
var logger = require('morgan');


const app = express();
app.use(express.static('public'));

app.use(logger('dev'));



passport.use(new GitHubStrategy({
	clientID: '',
	clientSecret: '',
	callbackURL: "http://localhost:3000/login/github/return"
}, function(accessToken, refreshToken, profile, cb) {
	return cb(null, profile);
}
));

passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'jennanda', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
    res.send('logged in as '+ req.user.displayName);
});

app.get('/login', function(req, res){
    res.send('login');
});


app.get('/login/github', passport.authenticate('github'));

app.get('/login/github/return', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        res.send('profile ' + req.user.displayName);
    });




// app.get('/auth/github/callback', 
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });


var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('Server loaded!');
});