import React from 'react';

import QuestionItem from './QuestionItem';

const QuestionsList = ({ questions, createExamMode, handleExamQuestions }) => {
  return (
    <div className='question-list'>
      { questions.map( question => 
        <QuestionItem 
          key={question._id}
          question={question}
          createExamMode={createExamMode}
          handleExamQuestions={handleExamQuestions}
        />
      )}
    </div>
  )
};

export default QuestionsList;