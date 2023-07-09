const Joi = require('joi');

const schemas = { 
  createExamDefinition: Joi.object().keys({ 
    name: Joi.string().required(),
    questions: Joi.array().items(Joi.string().required()).min(1).required()
  }),  
  assignExam: Joi.object().keys({ 
    students: Joi.array().items(Joi.string().required()).min(1).required(),
    scheduledTimeFrom: Joi.string().required(),
    scheduledTimeTo: Joi.string().required(),
  }),
  submitExam: Joi.object().keys({ 
    submittedQuestions: Joi.array().required()
  })
}; 
module.exports = schemas;