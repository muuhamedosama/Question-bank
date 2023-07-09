import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Login.css';
import { AuthContext } from '../../shared/context/auth-context';
import Error from '../../shared/components/Error';

const Login = () => {
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const loginSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login',
        JSON.stringify({
          username: loginForm.username,
          password: loginForm.password
        }),
        {
          headers:{
            'Content-Type': 'application/json'
          }
        }
      );
      login(data.userId, data.username, data.userType, data.token);
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
      <form className="form-collector" onSubmit={loginSubmitHandler}>
          <input 
            onChange={handleChange} 
            name='username'
            value={loginForm.username}
            type="text" 
            required 
            placeholder="Username"
          />
          <input 
            onChange={handleChange} 
            name='password' 
            value={loginForm.password}
            type="password" 
            required 
            placeholder="Password"
          />
          <button className="btn btn-primary" type="submit">LOGIN</button>
      </form>
    </div>
  )
};

export default Login;