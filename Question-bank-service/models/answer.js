const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const answerSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  relatedQuestion: { type: mongoose.Types.ObjectId, ref: 'Question' }
});

answerSchema.plugin(uniqueValidator);

module.exports =  mongoose.model('Answer', answerSchema);

