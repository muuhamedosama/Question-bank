import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';

import { AuthContext } from '../../shared/context/auth-context';
import ExamsList from '../components/ExamsList';
import Error from '../../shared/components/Error';

const Exams = () => {
  const [examDefinitions, setExamDefinitions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/exam/getexams', {
          headers: {
            authorization: `Bearer ${token}` 
          }
        });
        setExamDefinitions(data.exams);
      } catch (err) {
        setErrorMessage(err.response?.data?.message);
      }
    };
     fetchExams();
  }, []);

  if (!examDefinitions.length) {
    return <h2 className='container'>No exams available!</h2>
  }

  const clearError = () => {
    setErrorMessage(null);
  };

  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  };

  return (
    <ExamsList
      examDefinitions={examDefinitions}
    /> 
  )
};

export default Exams;