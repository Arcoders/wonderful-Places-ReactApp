var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

const db = require('./config/database');
const secrets = require('./config/secrets');
const jwtMiddleware = require('express-jwt');

db.connect();

// var indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const sessionsRouter = require('./routes/sessions');
const placesRouter = require('./routes/places');
const favoritesRouter = require('./routes/favorites');
const visitsRouter = require('./routes/visits');
const visitsPlacesRouter = require('./routes/visitsPlaces');
const applicationsRouter = require('./routes/applications');

const findAppBySecret = require('./middleware/findAppBySecret');
const findAppById = require('./middleware/findAppByApplicationId');
const authApp = require('./middleware/authApp')();
const allowCORs = require('./middleware/allowCORS')();

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(findAppBySecret);
app.use(findAppById);
app.use(authApp.unless({
  method: 'OPTIONS'
}));

app.use(allowCORs.unless({
  path: '/public'
}));

app.use(jwtMiddleware({
  secret: secrets.jwtSecret
}).unless({
  path: ['/sessions', '/users'],
  method: ['GET', 'OPTIONS'],
}));

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sessions', sessionsRouter);
app.use('/places', placesRouter);
app.use('/places', visitsPlacesRouter);
app.use('/favorites', favoritesRouter);
app.use('/visits', visitsRouter);
app.use('/applications', applicationsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
