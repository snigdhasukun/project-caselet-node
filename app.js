var express = require('express');
var bodyParser = require('body-parser');
// var createError = require('http-errors');
var logger = require('morgan');
var passport = require('passport');
var appInsights = require('applicationinsights');

var setup = require('./app/config/setup');
var config = require('./app/config/config');
var sequelize = require('./app/config/sequelize');
var caseletRouter = require('./app/routes/caseletRouter');
var filterRouter = require('./app/routes/filterRouter');
var tagRouter = require('./app/routes/tagRouter');
var adminRouter = require('./app/routes/adminRouter');
var imageRouter = require('./app/routes/imageRouter');
var userRouter = require('./app/routes/userRouter');

appInsights
  .setup(config.instrumentationKey)
  .start();

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/projectcaseletsapi/user', userRouter);
app.use('/projectcaseletsapi/caselet', caseletRouter);
app.use('/projectcaseletsapi/filter', filterRouter);
app.use('/projectcaseletsapi/tags', tagRouter);
app.use('/projectcaseletsapi/admin', adminRouter);
app.use('/projectcaseletsapi/image', imageRouter);

sequelize.createTables().then(res => {
  setup();
})


// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.json({ message: 'error'});
// });

module.exports = app;
