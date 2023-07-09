const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const uri = require('./utils/uri.json');
const messages = require('./utils/messages.json');
const notificationRoutes = require('./routes/notifications-routes');
const HttpError = require('./models/http-error');
const receiveNotifications  = require('./config');
const saveNotification = require('./middlewares/saveNotification');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use(uri.paths.baseUri, notificationRoutes);

app.use((req, res, next) => {
  const error = new HttpError(messages.error.routeNotExist, 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || messages.error.unknown });
});

receiveNotifications(notification => {
  saveNotification(notification)
    .catch(err => {
      res.status(err.code || 500);
      res.json({ message: err.message || messages.error.unknown });
    });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bl8okk1.mongodb.net/${process.env.DB_NAME}`
  )
  .then(() => {
    app.listen(port);
    console.log(`Server started at port ${port}`);
  })
  .catch(err => {
    console.log(err);
  });

