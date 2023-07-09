import React from 'react';

import ExamQuestionItem from './ExamQuestionItem';


const ExamQuestionsList = ({ examQuestions, handleSubmittedQuestions, submittedQuestions }) => {
  return (
    <div className='question-list'>
      { examQuestions.map((question, index) => 
        <ExamQuestionItem 
          key={index}
          examQuestion={question}
          handleSubmittedQuestions={handleSubmittedQuestions}
          submittedQuestion={submittedQuestions[index]}
          index={index}
        />
      )}
    </div>
  )
};

export default ExamQuestionsList;