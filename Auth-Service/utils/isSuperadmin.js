const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const messages = require('./messages.json');
const userTypes = require('./userTypes.json');

const superAdminCheck = req => {
  let isSuperAdmin;
  if (req.headers.authorization) {
    try {
      // Authorization: 'Bearer TOKEN'
      const superAdminToken = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(superAdminToken, process.env.TOKEN_KEY);
      isSuperAdmin = decodedToken?.userType === userTypes.superadmin;
    } catch (err) {
      const error = new HttpError(messages.error.createAdmin, 401);
      return next(error);
    }
  } 
  return isSuperAdmin;
};

module.exports = superAdminCheck;