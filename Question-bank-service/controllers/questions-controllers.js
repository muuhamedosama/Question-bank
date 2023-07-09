const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Redis = require('redis');
require('dotenv').config();

const HttpError = require('../models/http-error');
const Question = require('../models/question');
const Answer = require('../models/answer');
const schemas = require('../utils/bankServiceSchemas');
const messages = require('../utils/messages.json');
const userTypes = require('../utils/userTypes.json');

exports.createQuestion = async (req, res, next) => {
  if (req.userData?.userType !== userTypes.teacher) {
    const error = new HttpError(messages.error.createQuestion, 403);
    return next(error);
  };

  try {
    await schemas.createdQuestion.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 400);
    return next(error);
  }

  //answers is an array of objects that hold name, description and isCorrect.
  const { name, category, subcategory, mark, expectedTime, answers } = req.body;

  const isOneCorrect = answers.some(answer => answer.isCorrect === true);
  if (!isOneCorrect) {
    const error = new HttpError(messages.error.oneCorrectAnswer, 400);
    return next(error);
  }

  const createdQuestion = new Question({
    name,
    category,
    subcategory,
    mark,
    expectedTime,
    correctAnswers: [],
    createdBy: req.userData.userId,
    answers: []
  });

  const createdQuestionAnswers = answers.map(answer => {
    const createdAnswer = new Answer({
      name: answer.name,
      description: answer.description,
      relatedQuestion: createdQuestion._id
    });

    answer.isCorrect && createdQuestion.correctAnswers.push(createdAnswer._id);
    createdQuestion.answers.push(createdAnswer._id);

    return createdAnswer;
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdQuestion.save({ session: sess});
    for(const answer of createdQuestionAnswers){
      await answer.save({ session: sess});
    }
    await sess.commitTransaction();
  } catch(err) {
    const error = new HttpError(messages.error.server.createQuestion, 500);
    return next(error);
  }

  res.status(201).json({ createdQuestion: createdQuestion.toObject({ getters: true }) });
};

exports.getExamQuestions = async (req, res, next) => {
  const questionsId = JSON.parse(decodeURIComponent(req.query.questionsId));

  const isAuthorized = await bcrypt.compare(process.env.SERVICE_SECRET_KEY ,req.headers.secret)
  if (!isAuthorized) {
    const error = new HttpError(messages.error.authorization, 403);
    return next(error);
  }

  try {
    await schemas.getExamQuestions.validateAsync(questionsId);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 400);
    return next(error);
  }

  let questions;
  try {
    promiseArray = questionsId.map(async questionId => await Question.findById(questionId));
    questions = await Promise.all(promiseArray);
  } catch (err) {
     const error = new HttpError(messages.error.server.getQuestion, 500);
     return next(error);
  }

  if (!questions.length) {
     const error = new HttpError(messages.error.questionNotExist, 404);
     return next(error);
  }

  res.json({ questions });

};

exports.getAllQuestions = async (req, res, next) => {
  // if (req.userData?.userType === userTypes.student) {
  //   const error = new HttpError(messages.error.getQuestions, 403);
  //   return next(error);
  // };

  const { page = 1, limit = 4, filterByCategory, filterByUser } = req.query;
  const filters = filterByCategory && filterByUser ? 
    {
      category: filterByCategory,
      createdBy: filterByUser
    } 
    : filterByCategory ? 
    {
      category: filterByCategory
    } 
    : filterByUser ? 
    {
      createdBy: filterByUser
    } : {};
 
  let questions, count;
  try {
     questions = await Question.find(filters)
      .limit(limit)
      .skip((page - 1) * limit)

     count = await Question.countDocuments();
  } catch (err) {
    console.error(err.message);
  }
  
  res.json({
    questions,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  });
};

exports.updateQuestion = async (req, res, next) => {
  try {
    await schemas.updateQuestion.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 400);
    return next(error);
  }

  const { questionId } = req.params;
  const { name, category, subcategory, mark, expectedTime } = req.body;
  
  let question;
  try {
    question = await Question.findById(questionId);  
  } catch (err) {
    const error = new HttpError(messages.error.server.updateQuestion, 500);
    return next(error);
  }

  if (question.createdBy.toString() !== req.userData.userId) {
    const error = new HttpError(messages.error.updateQuestion, 403);
    return next(error);
  }

  try {
    await Question.updateOne({ _id: question._id }, { name, category, subcategory, mark, expectedTime});
  } catch (err) {
    const error = new HttpError(messages.error.server.updateQuestion, 500);
    return next(error);
  }

  res.json({ message: messages.success.updateQuestion });
};

exports.deleteQuestion = async (req, res, next) => { 
  const { questionId } = req.params;
  
  let question;
  try {
    question = await Question.findById(questionId).populate('answers'); 
  } catch (err) {
    const error = new HttpError(messages.error.server.deleteQuestion, 500);
    return next(error);
  }

  if (!question) {
    const error = new HttpError(messages.error.questionNotExist, 404);
    return next(error);
  } 

  if (req.userData?.userType !== userTypes.admin) {
    const error = new HttpError(messages.error.deleteQuestion, 403);
    return next(error);
  };

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Question.deleteOne({ _id: question._id }).session(sess);
    await Answer.deleteMany({ relatedQuestion: question._id }).session(sess);
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(messages.error.server.deleteQuestion, 500);
    return next(error);
  }

  res.json({ message: messages.success.deleted });
};