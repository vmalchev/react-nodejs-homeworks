'use strict';

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
const routes = require('./routes/index');

app.use('/', routes);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json('error', {
      message: err.message,
      error: err
    });
  });
} else {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json('error', {
      message: err.message,
      error: {}
    });
  });
}


app.listen(3000, () => console.log('API listening on port 3000!'))
