const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Question = require('../models/question');
const Answer = require('../models/answer');
const schemas = require('../utils/bankServiceSchemas');
const messages = require('../utils/messages.json');

exports.addAnswer = async (req, res, next) => {
  try {
    await schemas.addAnswer.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 400);
    return next(error);
  }

  const { questionId } = req.params;
  const { name, description, isCorrect } = req.body;
  
  let question;
  try {
    question = await Question.findById(questionId);  
  } catch (err) {
    const error = new HttpError(messages.error.server.updateQuestion, 500);
    return next(error);
  }

  if (!question) {
    const error = new HttpError(messages.error.questionNotExist, 404);
    return next(error);
  } 

  if (question.createdBy.toString() !== req.userData.userId) {
    const error = new HttpError(messages.error.updateQuestion, 403);
    return next(error);
  }

  const createdAnswer = new Answer({
    name,
    description,
    relatedQuestion: question._id
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdAnswer.save({ session: sess });
    question.answers.push(createdAnswer._id);
    isCorrect && question.correctAnswers.push(createdAnswer._id);
    await question.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(messages.error.server.createAnswer, 500);
    return next(error);
  }

  res.status(201).json({ createdAnswer: createdAnswer.toObject({ getters: true }) });

};

exports.deleteAnswer = async (req, res, next) => {
  const { answerId } = req.params;
  
  let answer;
  try {
    answer = await Answer.findById(answerId).populate('relatedQuestion');  
  } catch (err) {
    const error = new HttpError(messages.error.server.deleteAnswer, 500);
    return next(error);
  }

  if (!answer) {
    const error = new HttpError(messages.error.answerNotExist, 404);
    return next(error);
  } 

  if (answer.relatedQuestion.createdBy.toString() !== req.userData.userId) {
    const error = new HttpError(messages.error.deleteAnswer, 403);
    return next(error);
  }

  if (answer.relatedQuestion.answers.length === 2) {
    const error = new HttpError(messages.error.twoAnswers, 400);
    return next(error);
  };

  if(answer.relatedQuestion.correctAnswers.length === 1 && answer.relatedQuestion.correctAnswers.includes(answerId)) {
    const error = new HttpError(messages.error.oneCorrectAnswer, 400);
    return next(error);
  };

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Answer.deleteOne({ _id: answer._id}).session(sess);
    answer.relatedQuestion.answers.pull(answer._id);
    answer.relatedQuestion.correctAnswers.pull(answer._id);
    await answer.relatedQuestion.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(messages.error.server.deleteAnswer, 500);
    return next(error);
  }

  res.json({ message: messages.success.deleted });
};

exports.getAnswers = async (req, res, next) => {
  const { questionId } = req.params;

  let answers;
  try {
    answers = await Answer.find({ relatedQuestion: questionId });
  } catch (err) {
    const error = new HttpError(messages.error.server.getAnwsers, 500);
    return next(error);
  }

  if (answers.length === 0) {
    const error = new HttpError(messages.error.getAnswers, 404);
    return next(error);
  }

  res.json({ answers: answers.map(answer => answer.toObject({ getters: true })) });
};