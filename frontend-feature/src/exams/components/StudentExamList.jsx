import React, { useState } from 'react';

import Error from '../../shared/components/Error';
import StudentExamItem from './StudentExamItem';


const StudentExamsList = ({ examDefinitions, examInstances }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const clearError = () => {
    setErrorMessage(null);
  };
  
  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  }

  return (
    <div className='exam-list'>
      { examDefinitions.map((exam, index) => 
        <StudentExamItem 
          key={index}
          examDefinition={exam}
          examInstance={examInstances[index]}
        />
      )}
    </div>
  )
};

export default StudentExamsList;