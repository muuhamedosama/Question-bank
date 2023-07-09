import React from 'react';
import { Link } from 'react-router-dom';

const StudentExamItem = ({ examDefinition, examInstance }) => {
  return (
    <div className='exam-item container'>
      <div className='exam-wrapper'>
        <div> 
          <h2>{examDefinition.name}</h2>
          <div className='exam-subtitle'>
            <p>Passing score: {examDefinition.passingscore}% , </p>
            <p>Questions: {examDefinition.questions.length}</p>
          </div>
        </div>
        { examInstance.examstatus !== 'taken'
          ? <Link 
            to={ examInstance.generatedlink.url } 
            className='take-exam'
          >
            Take Exam
          </Link>
          : <h3>
              Your score is: 
              <span 
                style={{color: examInstance.grade >= 50 ? 'green' : 'red'}}
              >
                {examInstance.grade} %
              </span>
            </h3>
        }
      </div>
      <div className='exam-instance'>
        <h3>duration: {examInstance?.duration.hours} hours</h3>
        <h3>Scheduled From: {examInstance?.generatedlink.scheduledTimeFrom}</h3>
        <h3>Scheduled To: {examInstance?.generatedlink.scheduledTimeTo}</h3>
        <h3>status: {examInstance?.examstatus}</h3>
      </div>
    </div>
  )
};

export default StudentExamItem;