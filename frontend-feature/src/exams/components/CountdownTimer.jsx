import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ initialTime, handleExamSubmit }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (time === 0) {
      handleExamSubmit()
      alert("Time's up! Your exam has ended.");
    }
  }, [time]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return <div className='container countdown'>{formatTime(time)}</div>;
};

export default CountdownTimer;
