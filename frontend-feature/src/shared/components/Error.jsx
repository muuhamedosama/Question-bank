import React from 'react';

import './Error.css'

const Error = ({ message, clearError }) => {
  return (
    <div className="jumbotron container">
      <h1 className="display-4">Something went wrong!</h1>
      <hr className="my-4"/>
      <p>{message}</p>
      <button className='err-btn' onClick={clearError}>Try again</button>
    </div>
  )
}
export default Error;