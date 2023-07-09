import React, { useState, useContext } from 'react'

import '../pages/Exams.css';
import Student from './Student';
import Error from '../../shared/components/Error';
import { assignExamDefinition } from '../../../utils/assignExamDefinition';
import { AuthContext } from '../../shared/context/auth-context';

const ExamItem = ({ exam, students }) => {
  const [assignMode, setAssignMode] = useState(false);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [scheduledTimeFrom, setScheduledTimeFrom] = useState('');
  const [scheduledTimeTo, setScheduledTimeTo] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const { token } = useContext(AuthContext);

  const handleAssignMode = () => {
    setAssignMode(true);
  };

  const handleAssignCancel = () => {
    setAssignedStudents([]);
    setAssignMode(false);
  };

  const handleAssignSubmit = (event) => {
    event.preventDefault();
    assignExamDefinition(exam, assignedStudents, scheduledTimeFrom, scheduledTimeTo, token, setErrorMessage);
    setAssignedStudents([]);
    setAssignMode(false);
  };

  const handleAssignClick = student => {
    if (!assignedStudents.includes(student)) {
      setAssignedStudents(prevState => [...prevState, student]);
      alert("Successfully Assigned!");
    } else {
      alert("Student already assigned!");
    }
  };

  const handleStartDateChange = event => {
    setScheduledTimeFrom(event.target.value);
  };

  const handleEndDateChange = event => {
    setScheduledTimeTo(event.target.value);
  };

  const clearError = () => {
    setErrorMessage(null);
  };
  
  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  }

  return (
    <div className='exam-item container'>
      <div className='exam-wrapper'>
        <div> 
          <h2>{exam.name}</h2>
          <div className='exam-subtitle'>
            <p>Passing score: {exam.passingscore}% , </p>
            <p>Questions: {exam.questions.length}</p>
          </div>
        </div>
      </div>
      {
        assignMode && 
          <>
            <div className='date-options'>
              <label htmlFor="startDateInput">Select a start date:</label>
              <input
                type="datetime-local"
                id="startDateInput"
                value={scheduledTimeFrom}
                onChange={handleStartDateChange}
              />
              <label htmlFor="endDateInput">Select an end date:</label>
              <input
                type="datetime-local"
                id="endDateInput"
                value={scheduledTimeTo}
                onChange={handleEndDateChange}
              />
            </div>
            <div className='students'>
              {
                students.map(student => 
                  <Student 
                    key={student._id}
                    student={student}
                    handleAssignClick={handleAssignClick}
                  />
                )
              }
            </div>
            <div className='assign-exam'>
              <button 
                className='add-btn' 
                onClick={handleAssignSubmit} 
                disabled={!assignedStudents.length || !scheduledTimeFrom  || !scheduledTimeTo}
              >
                Submit
              </button>
              <button className='add-btn' onClick={handleAssignCancel} >Cancel</button> 
            </div>
          </>
      }
      {
        !assignMode &&
          <button className='add-btn' onClick={handleAssignMode} >Assign exam to students</button>
      }
    </div>
  )
}

export default ExamItem;