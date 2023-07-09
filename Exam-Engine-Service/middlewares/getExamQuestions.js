const axios = require('axios');
const HttpError = require('../models/http-error');

const getExamQuestions = async (questionsId, token, secret) => {
  let response;
  try {
      response = await axios.get(`http://localhost:5001/api/questions/getexamquestions`, {
      headers: {
        authorization: `Bearer ${token}` ,
        'Secret': secret
      },
      params: {
        questionsId: encodeURIComponent(JSON.stringify(questionsId))
      }
    });
  } catch (err) {
    throw new Error();
  }
   return response?.data.questions;
};

module.exports = getExamQuestions;