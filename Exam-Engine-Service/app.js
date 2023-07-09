const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const examRoutes = require('./routes/exam-routes');
const HttpError = require('./models/http-error');
const uri = require('./utils/uri.json');
const messages = require('./utils/messages.json');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.use(uri.paths.baseUri, examRoutes);

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

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

