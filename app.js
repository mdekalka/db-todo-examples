var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var EventEmitter = require('events').EventEmitter;

var mongo = require('mongodb');
// Monk is a layer that provides simple yet substantial usability improvements for MongoDB usage within Node.JS.
// var monk = require('monk');
// var db = monk('localhost:27017/nodeTest');

// var dbName = 'nodeTest';
// var connectionConfig = `mongodb://localhost:27017/${dbName}`;

// mongoose.connect(connectionConfig);
// var db = mongoose.connection;

// db.on('error', function() {
//     console.log('connection error');
// });

// db.once('open', function() {
//     console.log('connection established')
// });

var index = require('./routes/index');
var hello = require('./routes/hello');
var moviesRoute = require('./routes/movies');
const postgreRoute = require('./routes/postgreRoute');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(express.favicon());

// App.use is just a middleware functions
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/hi', hello);

app.use('/api', moviesRoute);

app.use('/postgre', postgreRoute);

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


// TEST API's from NodeJS Book
// 1) consistent function flow 
var flowStart = require('./modules/nimble-flow');
// flowStart();

// 2) Description of EventEmitter with example
var eventsServer = require('./modules/eventemitter/index');
// eventsServer.listen(8888);

// 3) Rss parser
const parser = require('./modules/rss-parser/rss-parser');
// parser()

// 4)  Socket.io chat example
const ioServer = require('./modules/chat/index');
// ioServer.listen(8008);

// 5) Postgre example
const pg = require('./modules/postgre/postgre');



module.exports = app;
