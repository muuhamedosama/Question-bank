const Joi = require('joi');

const schemas = { 
  signup: Joi.object().keys({ 
    username: Joi.string().required(),
    password: Joi.string().required().min(6),
    userType: Joi.string().required().valid('STUDENT', 'TEACHER', 'ADMIN')
  }),  
  login: Joi.object().keys({ 
    username: Joi.string().required(),
    password: Joi.string().required(),
  })
  
}; 
module.exports = schemas;