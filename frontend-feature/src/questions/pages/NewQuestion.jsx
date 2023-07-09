import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../../shared/context/auth-context';
import Error from '../../shared/components/Error';
import NewAnswer from '../components/NewAnswer';


const NewQuestion = () => {
  const [ questionForm, setQuestionForm ] = useState({
    name: '',
    category: '',
    subcategory: '',
    mark: '',
    expectedTime: '',
    answers: [
      {
        name: '',
        description:'',
        isCorrect: false
      },
      {
        name: '',
        description:'',
        isCorrect: false
      }
    ]
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setQuestionForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAnswersChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    setQuestionForm(prevState => {
      const updatedAnswers = [...prevState.answers];
      updatedAnswers[index] = {
        ...updatedAnswers[index],
        [name]: type === 'checkbox' ? checked : value
      };

      return {
        ...prevState,
        answers: updatedAnswers
      }
    })
  };
  
  const handleAddNewAnswer = () => {
    setQuestionForm(prevState => ({
      ...prevState,
      answers: [
        ...prevState.answers,
        {
          name: '',
          description: '',
          isCorrect: false
        }
      ]
    }));
  };

  const newQuestionSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/questions/create',
        JSON.stringify({
          name: questionForm.name,
          category: questionForm.category,
          subcategory: questionForm.subcategory,
          mark: Number(questionForm.mark),
          expectedTime: Number(questionForm.expectedTime),
          answers: questionForm.answers
        }),
        {
          headers:{
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}` 
          }
        }
      );
      navigate('/questions');
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
      <form className="form-collector" onSubmit={newQuestionSubmitHandler}>
          <input 
            onChange={handleChange} 
            name='name'
            value={questionForm.name}
            type="text" 
            required 
            placeholder="name"
          />
          <input 
            onChange={handleChange} 
            name='category'
            value={questionForm.category}
            type="text" 
            required 
            placeholder="category"
          /> 
          <input 
            onChange={handleChange} 
            name='subcategory'
            value={questionForm.subcategory}
            type="text" 
            required 
            placeholder="subcategory"
           />  
          <input 
            onChange={handleChange} 
            name='mark'
            value={questionForm.mark}
            type="text" 
            required 
            placeholder="mark"
           /> 
          <input 
            onChange={handleChange} 
            name='expectedTime'
            value={questionForm.expectedTime}
            type="text" 
            required 
            placeholder="expectedTime"
          />
          {
            questionForm.answers.map((answer, index) => (
              <NewAnswer 
                key={index}
                answer={answer}
                index={index}
                handleAnswersChange={handleAnswersChange}
              />
            ))
          }
          <button 
            className="btn" 
            type="button" 
            onClick={ handleAddNewAnswer }
          >
            Add new answer
          </button>
          <button className="btn btn-primary" type="submit">Create new question</button>
      </form>
    </div>
  )
};

export default NewQuestion;