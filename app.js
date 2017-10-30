var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


//non-default adds
//var db = require('./cfg/db')();
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var passport = require("passport");
var setUpPassport = require("./setuppassport");

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var app = express();
setUpPassport();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//====================================== DB init
var dbURI = 'mongodb://localhost/voltus5';
mongoose.connect(dbURI);
var db = mongoose.connection;

db.on('connected', function() {
  console.log('Mongoose conected on ' + dbURI);
});

db.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});

db.on('disconnected', function() {
  console.log('Mongoose disconnected');
});
//=======================================

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  name: 'voltus4rs',
  store: new mongoStore({ mongooseConnection: mongoose.connection, touchAfter: 24 * 3600}),
  secret: 'qwertyuiop123456789',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 15}
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use('/', index);
app.use('/users', users);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
