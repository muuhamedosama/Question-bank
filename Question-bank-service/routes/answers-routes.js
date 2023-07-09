const express = require('express');

const answersControllers = require('../controllers/answers-controllers');
const checkAuth = require('../middlewares/check-auth');
const uri = require('../utils/uri.json');

const router = express.Router();

// router.use(checkAuth);

router.get(uri.paths.answersPaths.endpoints.getAnswers, answersControllers.getAnswers); 

router.patch(uri.paths.answersPaths.endpoints.addAnswer, answersControllers.addAnswer); 

router.delete(uri.paths.answersPaths.endpoints.deleteAnswer, answersControllers.deleteAnswer);


module.exports = router;