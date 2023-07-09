import React from 'react';

const ExamAnswerItem = ({ answer, handleSubmittedQuestions, questionIsSubmitted, examQuestion }) => {
  return (
    <div className='exam-answers-wrapper'>
      <h2 className='answer'> {answer.name}</h2>
      {
        !questionIsSubmitted &&
          <input 
          className='checkbox' 
          type='checkbox'
          value={answer._id}
          onChange={ (event)=> handleSubmittedQuestions(examQuestion._id, event) }
        />
      }
    </div>
  )
};

export default ExamAnswerItem;