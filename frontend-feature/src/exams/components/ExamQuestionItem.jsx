import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios'; 

import { AuthContext } from '../../shared/context/auth-context';
import ExamAnswerItem from './ExamAnswerItem';
import Error from '../../shared/components/Error';


const ExamQuestionItem = ({ examQuestion, handleSubmittedQuestions, submittedQuestion, index }) => {
  const [answers, setAnswers] = useState(null);
  const [questionIsSubmitted, setQuestionIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { token } = useContext(AuthContext);

  const handleSubmitQuestion = () => {
    setQuestionIsSubmitted(true);
  };

  useEffect(() => {
    const fetchAnswres = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5001/api/answers/getanswers/${examQuestion._id}`, {
          headers: {
            authorization: `Bearer ${token}` 
          }
        });
        setAnswers(data.answers);
      } catch (err) {
        setErrorMessage(err.response?.data?.message);
      }
    };
    fetchAnswres();
  }, []);

  const clearError = () => {
    setErrorMessage(null);
  };

  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  };

  return (
    <div className='question-item container'>
      <div className='question-wrapper'>
        <div> 
          <h2>Q{index+1}.{examQuestion.name}</h2>
          <div className='question-subtitle'>
            <p>Category: {examQuestion.category},</p>
            <p>Subcategory: {examQuestion.subcategory},</p>
            <p>Time: {examQuestion.expectedTime} min,</p>
            <p>Mark: {examQuestion.mark}</p>
          </div>
        </div>
      </div>
      <div>
        {answers?.map(answer =>
          <ExamAnswerItem 
            key={answer._id} 
            answer={answer} 
            handleSubmittedQuestions={handleSubmittedQuestions}
            questionIsSubmitted={questionIsSubmitted}
            examQuestion={examQuestion}
          />
        )}
      </div>
      {
        !questionIsSubmitted &&
          <button 
            className='submit-answers' 
            onClick={handleSubmitQuestion}
            disabled={submittedQuestion.selectedAnswers.length === 0}
          >
            Submit Answers
          </button>
      }
      {
        questionIsSubmitted &&
          <h5 style={{color: '#84a59d'}}>Successfully submitted.</h5>
      }
    </div>
  )
};

export default ExamQuestionItem;