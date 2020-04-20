var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Parse = require('parse/node');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ParseStrategy = require('passport-parse');
var cookieSession = require('cookie-session');


//Parse.initialize('WCfqomGyScI1LUCLmZe83XuXKCyVzdLz', '', 'eB0pJR3f1SGFuFLzHmtOi8MfOVipsEd8');
//Parse.serverURL = 'https://istibdel.parse-server.karizma1.com/parse';
Parse.initialize('mAz3zGoYW2uJ6nR9kCLWhvQI4UEvKlFjFIvNywIV', '', 'cd2GakYAV7oH0xIFaraUHe22DghK7QhDlIovuUCq');
Parse.serverURL = 'https://161.35.1.1/parse';
Parse.Cloud.useMasterKey();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('root-path', __dirname);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser('58718458-0243-4FF6-83FD-D7C87F8CBD87', {
    httpOnly: true
}));

app.use(cookieSession({
    keys: ['58718458-0243-4FF6-83FD-D7C87F8CBD87'],
    name: 'session',
    maxAge: 60 * 60 * 1000 *24 * 30*2 // 2 month
}));

var parseStrategy = new ParseStrategy({
    parseClient: Parse
});
passport.use(parseStrategy);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    /*  var query = new Parse.Query("Configuration");
     query.first().then(function(config){
         if(config.get('maintenance')){
             res.render(('maintenance'));
         } */

    if (req.url == '/maintenance') {

        res.render('maintenance');

    }
    if (req.url == '/blocked') {

        res.render('blocked');

    }

    /* if (!req.user && req.url !== '/account/login' && req.url !== '/parse/users'&& req.url !== '/parse/classes/Configuration') {
        if (req.headers['X-Angular-Ajax-Request']) {
            res.status(401);
            res.json({ error: 'Unauthorized' });
        }
        else {
            res.redirect('/account/login');
           //res.render(('maintenance'));
        }
    } */

next();


});

var index = require('./routes/index');
var templates = require('./routes/template');
var account = require('./routes/account');
var parse = require('./routes/parse');
var upload = require('./routes/upload');
app.use('/upload', upload);
app.use('/parse/*', parse);
app.use('/account', account);
app.use('/template/*', templates);
/* var routes = require('./config/routes');
routes(app); */

app.use('*', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
