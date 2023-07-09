const HttpError = require('../models/http-error');
const Notification = require('../models/notification');
const userTypes = require('../utils/userTypes.json');
const messages = require('../utils/messages.json');

exports.getUserNotifications = async (req, res, next) => {
  const { username, userType } = req.userData;

  if (!(userType === userTypes.student || userType === userTypes.teacher)) {
    const error = new HttpError(messages.error.getNotifications, 403);
    return next(error);
  }

  let notifications;
  try {
    notifications = await Notification.find({ username });
  } catch (err) {
    const error = new HttpError(messages.error.server.getNotifications, 500);
    return next(error);
  }

  res.status(200).json({ notifications });

};
