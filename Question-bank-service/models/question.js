const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const arrayValidator = require('mongoose-array-validator');

const { Schema } = mongoose;
const questionSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    mark: { type: Number, required: true },
    expectedTime: { type: Number, required: true },
    correctAnswers: { type: [mongoose.Types.ObjectId], required: true, minItems: 1 },
    createdBy: { type: String, required: true},
    answers: { type: [mongoose.Types.ObjectId], required: true, minItems: 2 }
  },
  {
    timestamps: true
  }
);

questionSchema.plugin(uniqueValidator);
questionSchema.plugin(arrayValidator);

module.exports = mongoose.model('Question', questionSchema);

