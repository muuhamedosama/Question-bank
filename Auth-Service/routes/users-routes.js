const express = require('express');

const usersController = require('../controllers/users-controllers');
const uri = require('../utils/uri.json');

const router = express.Router();

router.post(uri.paths.endpoints.signup, usersController.signup);
router.post(uri.paths.endpoints.login, usersController.login);

router.get(uri.paths.endpoints.getStudents, usersController.getStudents);

module.exports = router; 