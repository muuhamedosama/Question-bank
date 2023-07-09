import React, { useState , useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../../shared/context/auth-context';
import Error from '../../shared/components/Error';

const UpdateQuestion = () => {
  const [ updatedForm, setUpdatedForm ] = useState({
    name: '',
    category: '',
    subcategory: '',
    mark: '',
    expectedTime: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);

  
  const { questionId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const updateQuestionSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/questions/update/${questionId}`,
        JSON.stringify({
          name: updatedForm.name,
          category: updatedForm.category,
          subcategory: updatedForm.subcategory,
          mark: Number(updatedForm.mark),
          expectedTime: Number(updatedForm.expectedTime),
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
  
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
      const { data } = await axios.get(`http://localhost:5001/api/questions/get/${questionId}`, {
        headers: {
          authorization: `Bearer ${token}` 
        }
      });
      setUpdatedForm(
        {
          name: data.question.name,
          category: data.question.category,
          subcategory: data.question.subcategory,
          mark: data.question.mark,
          expectedTime: data.question.expectedTime
        }
      );
      } catch (err) {
      setErrorMessage(err.response?.data?.message);
      }
    };
    fetchQuestion();
  }, []);


  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  };

  return (
    <div className="main-content">
      <form className="form-collector" onSubmit={updateQuestionSubmitHandler}>
          <input 
            onChange={handleChange} 
            name='name'
            value={updatedForm.name}
            type="text" 
            required 
            placeholder="name"
          />
          <input 
            onChange={handleChange} 
            name='category'
            value={updatedForm.category}
            type="text" 
            required 
            placeholder="category"
          /> 
          <input 
            onChange={handleChange} 
            name='subcategory'
            value={updatedForm.subcategory}
            type="text" 
            required 
            placeholder="subcategory"
           />  
          <input 
            onChange={handleChange} 
            name='mark'
            value={updatedForm.mark}
            type="text" 
            required 
            placeholder="mark"
           /> 
          <input 
            onChange={handleChange} 
            name='expectedTime'
            value={updatedForm.expectedTime}
            type="text" 
            required 
            placeholder="expectedTime"
          />
          <button className="btn btn-primary" type="submit">Update question</button>
      </form>
    </div>
  )
};

export default UpdateQuestion;