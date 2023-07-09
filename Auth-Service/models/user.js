const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userTypes = require('../utils/userTypes.json');

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    userType: { 
      type: String, 
      required: true, 
      enum : [userTypes.student, userTypes.teacher, userTypes.admin, userTypes.superadmin]
    }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
