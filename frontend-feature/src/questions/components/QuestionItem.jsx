import React, { useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

import { AuthContext } from '../../shared/context/auth-context';
import AddAnswer from './AddAnswer';
import AnswerItem from './AnswerItem';
import Error from '../../shared/components/Error';

const QuestionItem = ({ question, createExamMode, handleExamQuestions }) => { 
  const [answers, setAnswers] = useState(null);
  const [addAnswerClicked, setAddAnswerClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { userId, token, userType } = useContext(AuthContext);

  const handleAddAnswer = () => {
    setAddAnswerClicked(prevState => !prevState);
  };

  const handleDeleteAnswer = async answerId => {
    try {
      await axios.delete(`http://localhost:5001/api/answers/deleteanswer/${answerId}`, {
        headers: {
          authorization: `Bearer ${token}` 
        }
      });
      window.location.reload();
    } catch (err) {
      setErrorMessage(err.response?.data?.message);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
       await axios.delete(`http://localhost:5001/api/questions/deletequestion/${question._id}`, {
        headers: {
          authorization: `Bearer ${token}` 
        }
      });
      window.location.reload();
    } catch (err) {
      setErrorMessage(err.response?.data?.message);
    }
  };
  
  const clearError = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    const fetchAnswres = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5001/api/answers/getanswers/${question._id}`, {
          headers: {
            authorization: `Bearer ${token}` 
          }
        });
        setAnswers(data.answers);
      } catch (err) {
        console.error(err.response?.data?.message);
      }
    };
    fetchAnswres();
  }, []);
  
  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  };
  
  return (
    <div className='question-item'>
      <div className='question-wrapper'>
        <div> 
          <h2 className='question-name'>{question.name}</h2>
          <div className='question-subtitle'>
            <p>Category: {question.category},</p>
            <p>Subcategory: {question.subcategory},</p>
            <p>Time: {question.expectedTime} min,</p>
            <p>Mark: {question.mark}</p>
          </div>
        </div>
        {userId === question.createdBy && 
          !createExamMode && 
            (<div className='button-wrapper'>
              <Link to={`/update-question/${question._id}`} className='update-question'>Update Question</Link>
              <button className='add-btn' onClick={handleAddAnswer}>Add Answer</button>
            </div>)
        }
        {
          createExamMode && 
            <button className='add-btn' onClick={() => handleExamQuestions(question._id)}>Add Question To Exam</button>
        }
        {userType === 'ADMIN' && 
          <button className='delete-btn' onClick={handleDeleteQuestion}>Delete Question</button>
        }
      </div>
      <div>
        {answers?.map(answer => 
          <AnswerItem 
            key={answer._id} 
            answer={answer} 
            question={question} 
            userId={userId} 
            createExamMode={createExamMode}
            handleClick={handleDeleteAnswer}
          />
        )}
      </div>
      { addAnswerClicked && 
        <AddAnswer questionId={ question._id } />
      }
    </div>
  )
};

export default QuestionItem;