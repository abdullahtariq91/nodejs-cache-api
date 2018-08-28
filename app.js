const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize the server
global.ROOTURL = path.resolve(__dirname);
const app = express();

// Initialize the mongoose db
mongoose.Promise = require('bluebird');
mongoose.connect(require('./src/configurations/default').database.development, { useNewUrlParser: true });

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 1000000 }));

require('./src/routes/index')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
      message : err.message || "Failed"
    });
  });
}

// production error handler
// no stack-traces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send({
    message : err.message || "Failed"
  });
});

module.exports = app;
