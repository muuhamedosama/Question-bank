import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import ExamItem from './ExamItem';
import { AuthContext } from '../../shared/context/auth-context';
import Error from '../../shared/components/Error';


const ExamsList = ({ examDefinitions }) => {
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/users/getstudents', {
          headers: {
            authorization: `Bearer ${token}` 
          }
        });
        setStudents(data.students);
      } catch (err) {
        setErrorMessage(err.response?.data?.message);
      }
    };
    fetchAllStudents();
  }, []);

  const clearError = () => {
    setErrorMessage(null);
  };
  
  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  }

  return (
    <div className='exam-list'>
      { examDefinitions.map(exam => 
        <ExamItem 
          key={exam.id}
          exam={exam}
          students={students}
        />
      )}
    </div>
  )
};

export default ExamsList;