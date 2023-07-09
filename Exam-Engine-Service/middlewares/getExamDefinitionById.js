const pool = require('../utils/database');
const queries = require('../utils/queries');

const HttpError = require('../models/http-error');
const messages = require('../utils/messages.json');
const getExamDefinitionById = async examDefinitionId => {
  try {
    const results = await pool.query(queries.getExamDefinitionById, [examDefinitionId]);
    return results.rows[0];
  } catch (err) {
    throw new HttpError(messages.error.server.assignExam, 500);
  }
};

module.exports = getExamDefinitionById;