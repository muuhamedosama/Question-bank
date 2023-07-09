const mongoose = require('mongoose');

const { Schema } = mongoose;
const notificationSchema = new Schema(
  {
    username: { type: String, required: true },
    message: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);