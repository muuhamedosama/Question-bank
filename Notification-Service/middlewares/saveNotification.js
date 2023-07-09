const HttpError = require('../models/http-error');
const Notification = require('../models/notification');
const messages = require('../utils/messages.json');

module.exports = async notification => {
    const newNotification = new Notification({
      username: notification.username,
      message: notification.message,
    });
  
    try{
      await newNotification.save();
    } catch (err) {
      throw new HttpError(messages.error.saveNotification, 500);
    }
};