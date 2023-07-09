const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const messages = require('./messages.json');
const userTypes = require('./userTypes.json');

const SMECheck = req => {
  try {
    // Authorization: 'Bearer TOKEN'
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    isSME = decodedToken?.userType === userTypes.teacher || decodedToken?.userType === userTypes.admin;
  } catch (err) {
    const error = new HttpError(messages.error.fetchingStudents, 401);
    return next(error);
  }
  return isSME;
};

module.exports = SMECheck;