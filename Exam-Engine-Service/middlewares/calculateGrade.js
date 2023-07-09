const calculateGrade = (examQuestions, submittedQuestions) => {
  let studentGrade = 0;
  let questionGrade = 0;
  let fullGrade = 0;
  submittedQuestions.map(submittedQuestion => {
    const examQuestion = examQuestions.find(examQuestion => examQuestion._id === submittedQuestion.questionId);
    const questionCorrectAnswers = examQuestion.correctAnswers;
    fullGrade += examQuestion.mark;
    submittedQuestion.selectedAnswers.forEach(selectedAnswer => {
      if (questionCorrectAnswers.includes(selectedAnswer)) {
        questionGrade += (1/questionCorrectAnswers.length) * examQuestion.mark;
      } 
      else {
        questionGrade -= (1/questionCorrectAnswers.length) * examQuestion.mark;
      }
    });
    if (questionGrade < 0 ) {
      questionGrade = 0;
    }
    studentGrade += questionGrade;
    questionGrade = 0;
  });
  if (studentGrade < 0) {
    studentGrade = 0;
  }

  return (studentGrade / fullGrade) * 100;
};

module.exports = calculateGrade;