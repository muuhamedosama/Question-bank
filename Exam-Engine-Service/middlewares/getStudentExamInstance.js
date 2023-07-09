const pool = require('../utils/database');
const HttpError = require('../models/http-error');
const messages = require('../utils/messages.json');
const queries = require('../utils/queries');

const getStudentExamInstance = async (examDefinitionId, username, errorMessage) => {
  try {
    const results = await pool.query(queries.getStudentExam, [examDefinitionId, username]);
    if (!results.rows.length) {
     throw new HttpError(messages.error.examNotExist, 404);
     }
      return results.rows[0];
   } catch (err) {
    throw new HttpError(errorMessage, 500);
   }
};

module.exports = getStudentExamInstance;