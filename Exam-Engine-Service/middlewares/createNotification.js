const variables = require('../utils/variables.json');

const createNotification = (user, examName, assignMode, toTeacher, grade, submittedStudent) => {
  return  {
    username: user,
    message: assignMode 
      ? `You have been assigned to the ${examName} Exam. Prepare well and good luck!`
      : !assignMode && !toTeacher ? `Your grade for the ${examName} exam is ${grade}%.` 
      : `${submittedStudent} has submitted the ${examName} exam successfully.`
  };
}

module.exports = createNotification;