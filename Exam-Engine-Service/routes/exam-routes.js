const express = require('express');

const examControllers = require('../controllers/exam-controllers');
const checkAuth = require('../middlewares/check-auth');
const uri = require('../utils/uri.json');

const router = express.Router();

router.use(checkAuth);

router.post(uri.paths.endpoints.createExamDefinition, examControllers.createExamDefinition);
router.post(uri.paths.endpoints.assignExam, examControllers.assignExam);

router.patch(uri.paths.endpoints.submitExam, examControllers.submitExam);

router.get(uri.paths.endpoints.takeExam, examControllers.takeExam);
router.get(uri.paths.endpoints.getExamDefintions, examControllers.getExamDefintions);
router.get(uri.paths.endpoints.getStudentExams, examControllers.getStudentExams);

module.exports = router;
