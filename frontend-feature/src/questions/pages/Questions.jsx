import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './Questions.css';
import QuestionsList from '../components/QuestionsList';
import { AuthContext } from '../../shared/context/auth-context';
import Error from '../../shared/components/Error';
import Pagination from '../components/Pagination';
import { createExamDefinition } from '../../../utils/createExamDefinition';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [createExamMode, setCreateExamMode] = useState(false);
  const [examName, setExamName] = useState('');
  const [examQuestions, setExamQuestions] = useState([]);
  const [filterByCategory, setFilterByCategory] = useState('');
  const [filterByUser, setFilterByUser] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(null);
  const { token, userType, userId } = useContext(AuthContext);

  const handleCurrentPage = currPage => {
    setCurrentPage(currPage);
  }

  const handleClearFilters = () => {
    setFilterByCategory('');
    setFilterByUser('');
  };

  const handleCreateExam = () => {
    setCreateExamMode(true);
  };

  const handleCancelExam = () => {
    setExamQuestions([]);
    setExamName('');
    setCreateExamMode(false);
  };

  const handleExamNameChange = (event) => {
    setExamName(event.target.value);
  };

  const handleExamQuestions = questionId => {
    if (!examQuestions.includes(questionId)) {
      setExamQuestions(prevState => [...prevState, questionId]);
      alert("Successfully added!");
    } else {
      alert("Question already added!");
    }
  };

  const handleSubmitExam = (event) => {
    event.preventDefault();
    createExamDefinition(examName, examQuestions, token, setErrorMessage);
    setExamQuestions([]);
    setExamName('');
    setCreateExamMode(false);
  };

  const clearError = () => {
    setErrorMessage(null);
  };
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
      const { data } = await axios.get('http://localhost:5001/api/questions/get/all', 
        {
          params: { page: currentPage, filterByCategory, filterByUser},
          headers: {
            authorization: `Bearer ${token}` 
          }
        }
      );
      setQuestions(data.questions);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      } catch (err) {
      setErrorMessage(err.response?.data?.message);
      }
    };
     fetchQuestions();
  }, [currentPage, filterByCategory, filterByUser]);

  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  }

  if (userType !== 'TEACHER' && questions.length === 0) {
    return <h1 className='container'>There are no questions!</h1>
  }

  return (
    <div className='container questions-page'>
      {userType === 'TEACHER' && 
        !createExamMode &&
        <>      
          <div className='filter-options'>
            <input 
              className='category-filter' 
              onChange={event => setFilterByCategory(event.target.value)} 
              placeholder='filter by category'
              value={filterByCategory}
            />
            <button 
              type='button'
              className='filter-by-user'
              onClick={() => setFilterByUser(userId)}  
            >
              My Questions
            </button>
            <button 
              type='button' 
              className='remove-filter'
              onClick={handleClearFilters}
            > 
              Remove Filter
            </button>
          </div>  
          <div className='create-options'>
            <Link to={'/new-question'} className='create-question'>Create Question</Link>
            <button className='create-exam' onClick={handleCreateExam}>Create Exam</button>
          </div>
        </>
      }
      {
        userType === 'TEACHER' &&
          createExamMode &&
            <form className='exam-options'>
              <input 
                className='exam-name-holder'
                type='text'
                placeholder='Exam name'
                onChange={handleExamNameChange}
              />
              <button type='submit' className='handle-exam' onClick={handleSubmitExam}>Submit exam</button>
              <button type='button' className='handle-exam' onClick={handleCancelExam}>Cancel</button>
            </form> 
      }
      <QuestionsList
         questions={questions}
         createExamMode={createExamMode}
         handleExamQuestions={handleExamQuestions}
      /> 
      <Pagination 
        totalPages={totalPages} 
        currentPage={currentPage}
        handleClick={handleCurrentPage} 
      />
    </div>
  )
};

export default Questions;