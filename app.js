const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const EventEmitter = require('events').EventEmitter;
const redis = require('redis');


const index = require('./routes/index');
const hello = require('./routes/hello');

const mongoRoute = require('./routes/mongoRoutes');
const postgreRoute = require('./routes/postgreRoute');
const mysqlRoute = require('./routes/mysqlRoute');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(express.favicon());

// App.use is just a middleware functions
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/hi', hello);

app.use('/mongo', mongoRoute);
app.use('/postgre', postgreRoute);
app.use('/mysql', mysqlRoute);

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



// Note: redis will not start on Windows without redis-server
// https://github.com/MSOpenTech/redis
// var redisClient = redis.createClient();

// redisClient.on('connect', function() {
//   console.log('connected to redis')
// });

// redisClient.on('error', function(err) {
//   console.log('redis connection error: ', err);
// });

// redisClient.set('color', 'red', redisClient.primt);
// redisClient.get('color', function(err, value) {
//   if (err) {
//     throw err;
//   }
//   console.log('Got it: ', value);
// });

// // Set hash-table values
// redisClient.hmset('object', {
//   'first': 'some value',
//   'second': 'some another value'
// }, redis.print);
// // get the value of first property
// redisClient.hget('object', 'first', function(err, value) {
//   if (err) throw err;

//   console.log('First value is: ', value);
// });
// // get hash-table keys
// redisClient.hkeys('object', function(err, keys) {
//   if (err) throw err;

//   keys.forEach(function(key, i) {
//     console.log(' ' + key);
//   });
// });

// // working with lists;
// redisClient.lpush('tasks', 'first value', redis.print);
// redisClient.lpush('tasks', 'second value', redis.print);
// redisClient.lrange('tasks', 0, -1, function(err, items) {
//   if (err) throw err;
//   items.forEach(function(item, i) {
//     console.log(' ' + item);
//   });
// });

// // unordered group of strings
// redisClient.sadd('ip', '204.10.65.56', redis.print);
// // same value will bei gnored
// redisClient.sadd('ip', '204.10.65.56', redis.print);
// redisClient.sadd('ip', '74.10.65.56', redis.print);
// redisClient.smembers('ip', function(err, members) {
//   if (err) throw err;

//   console.log(members);
// });

module.exports = app;
