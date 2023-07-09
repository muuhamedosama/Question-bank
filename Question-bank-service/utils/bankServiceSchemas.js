const Joi = require('joi');

let answer = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.any(),
  isCorrect: Joi.boolean().required()
})

const schemas = { 
  
  createdQuestion: Joi.object().keys({ 
    name: Joi.string().required(),
    category: Joi.string().required(),
    subcategory: Joi.string().required(),
    mark: Joi.number().required(),
    expectedTime: Joi.number().required(),
    answers: Joi.array().min(2).items(answer).required()
  }),  
  updateQuestion: Joi.object().keys({ 
    name: Joi.string().required(),
    category: Joi.string().required(),
    subcategory: Joi.string().required(),
    mark: Joi.number().required(),
    expectedTime: Joi.number().required(),
  }),
  addAnswer: Joi.object().keys({ 
    name: Joi.string().required(),
    description: Joi.any(),
    isCorrect: Joi.boolean().required(),
  }),
  getExamQuestions: Joi.array().items(Joi.string()).min(1)
}; 
module.exports = schemas;