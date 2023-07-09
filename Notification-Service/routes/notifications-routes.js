const express = require('express');

const notificationsController = require('../controllers/notifications-controllers');
const checkAuth = require('../middlewares/check-auth');
const uri = require('../utils/uri.json');

const router = express.Router();

router.use(checkAuth);

router.get(uri.paths.endpoints.getUserNotifications, notificationsController.getUserNotifications);

module.exports = router; 