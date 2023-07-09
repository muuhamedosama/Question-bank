import React from 'react';

const Student = ({ student, handleAssignClick }) => {
  return (
    <div className='student-wrapper'>
      <h2 className='student'>- {student.username}</h2>
      <button 
        onClick={() => handleAssignClick(student.username)} 
        className='assign-student-btn'
      >
        +
      </button>
    </div>
  )
};

export default Student;