import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

import './Signup.css';
import { AuthContext } from '../../shared/context/auth-context';
import Error from '../../shared/components/Error';

const Signup = () => {
  const { login, userType, token } = useContext(AuthContext);
  
  const [signupForm, setSignupForm] = useState({
    username: '',
    password: '',
    userType: userType === 'SUPER_ADMIN'? 'ADMIN' :'STUDENT'
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignupForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const signupSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/signup',
        JSON.stringify({
          username: signupForm.username,
          password: signupForm.password,
          userType: signupForm.userType
        }),
        {
          headers:{
            'Content-Type': 'application/json',
             authorization: userType === 'SUPER_ADMIN' && `Bearer ${token}` 
          }
        }
      );
      userType !== 'SUPER_ADMIN' && login(data.userId, data.username, data.userType, data.token);
      navigate('/');
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
      <form className="form-collector" onSubmit={signupSubmitHandler}>
          <input 
            onChange={handleChange} 
            name='username'
            value={signupForm.username}
            type="text" 
            required 
            placeholder="Username"
          />
          <input 
            onChange={handleChange} 
            name='password' 
            value={signupForm.password}
            type="password" 
            required 
            placeholder="Password"
          />
          {userType !== 'SUPER_ADMIN' &&
              <select 
              onChange={handleChange} 
              className='select' 
              name="userType" 
              value={signupForm.userType}
              required
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
          }
          <button className="btn btn-signup" type="submit">{userType === 'SUPER_ADMIN' ? 'CREATE ADMIN': 'REGISTER'}</button>
      </form>
    </div>
  )
};

export default Signup;