const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const schemas = require('../utils/authSchemas');
const messages = require('../utils/messages.json');
const userTypes = require('../utils/userTypes.json');
const variables = require('../utils/variables.json');
const superAdminCheck = require('../utils/isSuperadmin');
const SMECheck = require('../utils/isSME');

exports.signup = async (req, res, next) => {
  try {
    await schemas.signup.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 403);
    return next(error);
  }

  const isSuperAdmin = superAdminCheck(req);  
  const { username, password, userType } = req.body;

  if (userType === userTypes.superadmin) {
    const error = new HttpError(messages.error.createSuperadmin , 401);
    return next(error);
  };
  
  if (userType === userTypes.admin && !isSuperAdmin) {
    const error = new HttpError(messages.error.createAdminAuth , 403);
    return next(error);
  };

  let createdUser;
  let token;
  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      const error = new HttpError(messages.error.userExist, 409);
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    createdUser = new User({
      username,
      password: hashedPassword,
      userType
    });
    await createdUser.save();

    token = jwt.sign(
      {
      userId: createdUser.id,
      username: createdUser.username,
      userType: createdUser.userType
      },
      process.env.TOKEN_KEY,
      { expiresIn: variables.durations.hour }
    );
  } catch (err) {
    const error = new HttpError(messages.error.server.signup, 500);
    return next(error);
  }

  res
    .status(201)
    .json({
      message: messages.success.signup,
      username: createdUser.username,
      userType: createdUser.userType,
      userId: createdUser.id,
      token
    });
};

exports.login = async (req, res, next) => {
  try {
    await schemas.login.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 403);
    return next(error);
  }

  const { username, password } = req.body;

  let existingUser;
  let token;
  try {
    existingUser = await User.findOne({ username });
    if (!existingUser) {
      const error = new HttpError(messages.error.invalidCredentials, 403);
      return next(error);
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      const error = new HttpError(messages.error.invalidCredentials, 403);
      return next(error);
    }

    token = jwt.sign(
      {
      userId: existingUser.id,
      username: existingUser.username,
      userType: existingUser.userType
      },
      process.env.TOKEN_KEY,
      { expiresIn: variables.durations.hour }
    );
  } catch (err) {
    const error = new HttpError(messages.error.server.login, 500);
    return next(error);
  }

  res
    .status(200)
    .json({
      message: messages.success.login,
      username: existingUser.username,
      userType: existingUser.userType,
      userId: existingUser.id,
      token
    });

};

exports.getStudents = async (req, res, next) => {
  const isSME = SMECheck(req);

  if (!isSME) {
    const error = new HttpError(messages.error.authorization, 401);
    return next(error);
  }

  let students;
  try {
     students = await User.find({ userType: userTypes.student })
  } catch (err) {
    console.error(err.message);
  }
  
  res.status(200).json({ students });
} ;