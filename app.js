var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Database
//var mongo = require('mongodb');
//var monk = require('monk');
//var db = monk('localhost:27017/littlechef');

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/gistracker');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log('yay');

});

var jwt        = require("jsonwebtoken");


var routes = require('./routes/index');
var users = require('./routes/users');
var requests = require('./routes/request');
var mailer = require('./routes/mailer');

var app = express();
var fs = require("fs");
var privatekey = fs.readFileSync('./security/private.pem');
var publickey = fs.readFileSync('./security/public.pem');

// parse application/json
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.jwt = jwt;
    req.privatekey = privatekey;
    req.publickey = publickey;
    req.mongoose = mongoose;
    next();
});
app.use('/', routes);
app.use('/users', users);
app.use('/requests', requests);
app.use('/mailer', mailer);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
