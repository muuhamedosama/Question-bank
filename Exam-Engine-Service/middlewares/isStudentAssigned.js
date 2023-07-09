const pool = require('../utils/database');
const queries = require('../utils/queries');

const isStudentAssigned = async (examDefinitionId, username, errorMessage) => {
  try {
    const results = await pool.query(queries.getStudentExam, [examDefinitionId, username]);
    return !!results.rows.length;
   } catch (err) {
    console.error(errorMessage, 500);
   }
};

module.exports = isStudentAssigned;