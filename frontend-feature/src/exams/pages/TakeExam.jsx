import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../../shared/context/auth-context';
import { submitExam } from '../../../utils/submitExam';
import ExamQuestionsList from '../components/ExamQuestionsList';
import Error from '../../shared/components/Error';
import CountdownTimer from '../components/CountdownTimer';

const TakeExam = () => {
  const [examQuestions, setExamQuestions] = useState([]);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const { token } = useContext(AuthContext);
  const { examId } = useParams();
  const navigate = useNavigate();

  const handleExamSubmit = event => {
    event?.preventDefault();
    submitExam(examId, submittedQuestions, token, setErrorMessage);
    navigate('/');
  };

  const handleSubmittedQuestions = (qId, event) => {
    const { checked, value } = event.target;
    setSubmittedQuestions(prevState => prevState.map(question => {
      if (question.questionId === qId) {
        if (checked) {
          return {
            ...question,
            selectedAnswers: [...question.selectedAnswers, value]
          }
        } else {
          return {
            ...question,
            selectedAnswers: question.selectedAnswers.filter(answer => answer !== value)
          };
        }
      } else {
        return question;
      }
    }));
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/api/exam/takeexam/${examId}`, {
          headers: {
            authorization: `Bearer ${token}` 
          }
        });
        setExamQuestions(data.questions);
        setSubmittedQuestions(data.assignedQuestions);
      } catch (err) {
        setErrorMessage(err.response?.data?.message);
      }
    };
    fetchQuestions();
  },[]);

  const clearError = () => {
    setErrorMessage(null);
    navigate('/');
  };

  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  };

  
  return (
    <>
      <CountdownTimer 
        initialTime={100}
        handleExamSubmit={handleExamSubmit}
      />
      <ExamQuestionsList 
        examQuestions={examQuestions}
        handleSubmittedQuestions={handleSubmittedQuestions}
        submittedQuestions={submittedQuestions}
      />
      <form className="form-collector container" onSubmit={handleExamSubmit}>
        <button 
          className='btn btn-primary submit-exam-btn'
          disabled={submittedQuestions.some(question => question.selectedAnswers.length === 0)}
        >
          Submit Exam
        </button>
      </form>
    </>

  )
};

export default TakeExam;