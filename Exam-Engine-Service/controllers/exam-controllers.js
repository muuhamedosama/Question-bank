const bcrypt = require('bcrypt');
require('dotenv').config();

const HttpError = require('../models/http-error');
const pool = require('../utils/database');
const queries = require('../utils/queries');
const getExamQuestions = require('../middlewares/getExamQuestions');
const calculateGrade = require('../middlewares/calculateGrade');
const getStudentQuestions = require('../middlewares/getStudentQuestions');
const getStudentExamInstance = require('../middlewares/getStudentExamInstance');
const getExamDefinitionById = require('../middlewares/getExamDefinitionById');
const createNotification = require('../middlewares/createNotification');
const isStudentAssigned = require('../middlewares/isStudentAssigned');
const schemas = require('../utils/schemas');
const messages = require('../utils/messages.json');
const userTypes = require('../utils/userTypes.json');
const variables = require('../utils/variables.json');
const { pushNotification } = require('../config');

exports.createExamDefinition = async (req, res, next) => {
  const { name, questions } = req.body;
  const { userType } = req.userData;

  if (!(userType === userTypes.teacher || userType === userTypes.admin)) {
    const error = new HttpError(messages.error.createExam, 403);
    return next(error);
  }

  try {
    await schemas.createExamDefinition.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 400);
    return next(error);
  }

  try {
    const results = await pool.query(queries.createExamDefintion, [name, questions]);
    res.status(201).json({ message: messages.success.createExam, examId: results.rows[0].id });
  } catch (err) {
    const error = new HttpError(messages.error.server.createExam, 500);
    return next(error);
  }
};

exports.getExamDefintions = async (req, res, next) => {
  const { userType } = req.userData;
  if (!(userType === userTypes.teacher || userType === userTypes.admin)) {
    const error = new HttpError(messages.error.getExams, 403);
    return next(error);
  }

  try {
    const results = await pool.query(queries.getExamDefinitions);
    res.status(200).json({ exams: results.rows });
  } catch (err) {
    const error = new HttpError(messages.error.server.getExams, 500);
    return next(error);
  }
};

exports.getStudentExams = async (req, res, next) => {
  const { username, userType } = req.userData;
  if (userType !== userTypes.student) {
    const error = new HttpError(messages.error.getExams, 403);
    return next(error);
  }

  let studentExamInstances;
  try {
    const results = await pool.query(queries.getExamInstances, [username]);
    studentExamInstances = results.rows;
  } catch (err) {
    const error = new HttpError(messages.error.server.getExams, 500);
    return next(error);
  }

  const promiseArray = studentExamInstances.map(async instance => {
    try {
      const results = await pool.query(queries.getExamDefinitionById, [instance.examdefinition_id]);
      return results.rows[0];
    } catch (err) {
      const error = new HttpError(messages.error.server.getExams, 500);
      return next(error);
    }
  });
  const studentExamDefinitions = await Promise.all(promiseArray);

  res.status(200).json({ studentExamDefinitions, studentExamInstances });
};

exports.assignExam = async (req, res, next) => {
  const { students, scheduledTimeFrom, scheduledTimeTo } = req.body;
  const { username, userType } = req.userData;
  const examDefinitionId = parseInt(req.params.examDefinitionId);

  if (!(userType === userTypes.teacher || userType === userTypes.admin)) {
    const error = new HttpError(messages.error.assignExam, 403);
    return next(error);
  }

  try {
    await schemas.assignExam.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 400);
    return next(error);
  }

  let questions;
  let examDefinition;
  try {
    questions = await getStudentQuestions(examDefinitionId, messages.error.server.assignExam);
    examDefinition = await getExamDefinitionById(examDefinitionId);
  } catch (err) {
    return next(err);
  }

  const assignedQuestions = questions.map(question => ({
    questionId: question,
    selectedAnswers: []
  }));
  
  const generatedLink = {
    scheduledTimeFrom,
    scheduledTimeTo,
    token: '',
    url: `/takeexam/${examDefinitionId}`
  };

  let isAllExamsAssigned = true;
  students.forEach(async student => {
    const isAlreadyAssigned = await isStudentAssigned(examDefinitionId, student, messages.error.server.assignExam)
    if (isAlreadyAssigned) return;
    try {
      await pool.query(queries.assignExam, [examDefinitionId, generatedLink, username, student, variables.status.absent, JSON.stringify(assignedQuestions)]);
      await pushNotification(process.env.KAFKA_TOPIC,createNotification(student, examDefinition.name, true ));
    } catch (err) {
      isAllExamsAssigned = isAllExamsAssigned && false;
    }
  }); 

  if (!isAllExamsAssigned) {
    const error = new HttpError(messages.error.server.assignExam, 500);
    return next(error);
  }

  res.status(201).json({ message: messages.success.assignExam });
};

exports.takeExam = async (req, res, next) => {
  const { username, userType, token } = req.userData;
  const examDefinitionId = parseInt(req.params.examDefinitionId);

  if (userType !== userTypes.student) {
    const error = new HttpError(messages.error.takeExam, 403);
    return next(error);
  }
   
  let studentExamInstance;
  try{
    studentExamInstance = await getStudentExamInstance(examDefinitionId, username, messages.error.server.takeExam);
  } catch (err) {
    return next(err)
  }

  if (studentExamInstance.examstatus === variables.status.taken) {
    const error = new HttpError(messages.error.retakeExam, 403);
    return next(error);
  }

  const currDate = new Date();
  const startedTime = currDate.getHours() + ':' + currDate.getMinutes() + ':' + currDate.getSeconds();

  let questions;
  try{
    const questionsId = await getStudentQuestions(examDefinitionId, messages.error.server.takeExam);
    const secret = await bcrypt.hash(process.env.SERVICE_SECRET_KEY, 10);
    questions = await getExamQuestions(questionsId, token, secret);
  } catch (err) {
    return next(err);
  }

  if (!questions.length) {
    const error = new HttpError(messages.error.server.takeExam, 500);
    return next(error);
  }

  questions.forEach(question => delete question.correctAnswers);

  try {
    await pool.query(queries.updateStudentExamTaken, [startedTime, variables.status.taken, studentExamInstance.id]);
  } catch (err) {
    const error = new HttpError(messages.error.server.takeExam, 500);
    return next(error);
  }

  //Assigned questions are the blue print for the submitted questions by student
  res.status(200).json({ questions: questions, assignedQuestions: studentExamInstance.questions });

};

exports.submitExam = async (req, res, next) => {
  const { submittedQuestions } = req.body;
  const { username, userType, token } = req.userData;
  const examDefinitionId = parseInt(req.params.examDefinitionId);

  if (userType !== userTypes.student) {
    const error = new HttpError(messages.error.submitExam, 403);
    return next(error);
  }

  try {
    await schemas.submitExam.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 400);
    return next(error);
  }

  let studentExamInstance;
  let examDefinition;
  try {
    studentExamInstance = await getStudentExamInstance(examDefinitionId, username, messages.error.server.submitExam);
    examDefinition = await getExamDefinitionById(examDefinitionId);
  }
  catch (err) {
    return next(err)
  }

  const updatedGeneratedLink = {
    ...studentExamInstance.generatedlink,
    token
  };
  const currDate = new Date();
  const endTime = currDate.getHours() + ':' + currDate.getMinutes() + ':' + currDate.getSeconds();

  let questions;
  try{
    const questionsId = await getStudentQuestions(examDefinitionId, messages.error.server.submitExam);
    const secret = await bcrypt.hash(process.env.SERVICE_SECRET_KEY, 10);
    questions = await getExamQuestions(questionsId, token, secret);
  } catch (err) {
    return next(err);
  }
  
  if (!questions.length) {
    const error = new HttpError(messages.error.server.takeExam, 500);
    return next(error);
  }

  const grade = calculateGrade(questions, submittedQuestions).toFixed(2);

  try {
    await pool.query(queries.updateStudentExamSubmitted, [updatedGeneratedLink, endTime, JSON.stringify(submittedQuestions), grade, studentExamInstance.id]);
    await pushNotification(process.env.KAFKA_TOPIC, createNotification(username, examDefinition.name, false, false, grade ));
    await pushNotification(process.env.KAFKA_TOPIC, createNotification(studentExamInstance.createdby, examDefinition.name, false, true, grade, username ));
  } catch (err) {
    const error = new HttpError(messages.error.server.submitExam, 500);
    return next(error);
  }

  res.status(200).json({ grade });
};