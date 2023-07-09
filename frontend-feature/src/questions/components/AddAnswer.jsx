import React, { useState, useContext} from 'react';
import axios from 'axios';

import { AuthContext } from '../../shared/context/auth-context';
import Error from '../../shared/components/Error';

const AddAnswer = ({ questionId }) => {
  const [answerForm, setAnswerForm] = useState({
    answer: '',
    answerdesc: '',
    isAnswerCorrect: false
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const { token } = useContext(AuthContext);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAnswerForm(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const newAnswerSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await axios.patch(`http://localhost:5001/api/answers/addanswer/${questionId}`,
        JSON.stringify({
          name: answerForm.answer,
          description: answerForm.answerdesc,
          isCorrect: answerForm.isAnswerCorrect
        }),
        {
          headers:{
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}` 
          }
        }
      );
      window.location.reload();
    } catch (err) {
      setErrorMessage(err.response?.data?.message);
    }
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  };

  return (
    <div className="main-content">
      <form className="form-collector" onSubmit={newAnswerSubmitHandler}>
        <input 
          onChange={handleChange} 
          name='answer' 
          value={answerForm.answer}
          type="text" 
          required 
          placeholder="answer"
        />
        <input 
          onChange={handleChange} 
          name='answerdesc' 
          value={answerForm.answerdesc}
          type="text" 
          placeholder="answer description (optional)"
        />
        <input 
          onChange={handleChange} 
          name='isAnswerCorrect' 
          value={answerForm.isAnswerCorrect}
          type="checkbox" 
        />
        <button className="btn btn-primary" type="submit">Add Answer</button>
      </form>
    </div>  
  )
};

export default AddAnswer;