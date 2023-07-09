const jwt = require('jsonwebtoken');
require('dotenv').config();

const HttpError = require('../models/http-error');
const messages = require('../utils/messages.json');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    // Authorization: 'Bearer TOKEN'
    const token = req.headers.authorization.split(' ')[1]; 
    if (!token) {
      const error = new HttpError(messages.error.authentication, 401);
      return next(error);
    }
    
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    req.userData = { username: decodedToken.username, userType: decodedToken.userType };
    next();
  } catch (err) {
    const error = new HttpError(messages.error.authentication, 401);
    return next(error);
  }
};