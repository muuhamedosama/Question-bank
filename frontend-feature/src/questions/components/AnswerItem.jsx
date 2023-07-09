import React from 'react';

const AnswerItem = ({ answer, handleClick, userId, question, createExamMode }) => {
  return (
    <div className='answers-wrapper'>
      <h2 className='answer'>- {answer.name}</h2>
      { userId === question.createdBy && 
          !createExamMode &&
            <button 
              onClick={() => handleClick(answer._id)} 
              className='deleteanswer-btn'
            >
              delete
            </button>
      }
    </div>
  )
};

export default AnswerItem;