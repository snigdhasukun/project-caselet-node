var express = require('express');
var bodyParser = require('body-parser');
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
var metadataRouter = require('./app/routes/metadataRouter');
var technologyRouter = require('./app/routes/technologyRouter');
var toolRouter = require('./app/routes/toolRouter');

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
app.use('/projectcaseletsapi/metadata', metadataRouter);
app.use('/projectcaseletsapi/technologies', technologyRouter);
app.use('/projectcaseletsapi/tools', toolRouter);

sequelize.createTables().then(res => {
  setup();
})

module.exports = app;
