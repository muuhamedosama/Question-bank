const express = require('express');

const questionsControllers = require('../controllers/questions-controllers');
const checkAuth = require('../middlewares/check-auth');
const uri = require('../utils/uri.json');

const router = express.Router();

// router.use(checkAuth);

router.post(uri.paths.questionsPaths.endpoints.createQuestion, questionsControllers.createQuestion);

router.get(uri.paths.questionsPaths.endpoints.getAllQuestions, questionsControllers.getAllQuestions); 
router.get(uri.paths.questionsPaths.endpoints.getExamQuestions, questionsControllers.getExamQuestions); 

router.put(uri.paths.questionsPaths.endpoints.updateQuestion, questionsControllers.updateQuestion); 

router.delete(uri.paths.questionsPaths.endpoints.deleteQuestion, questionsControllers.deleteQuestion); 

module.exports = router;