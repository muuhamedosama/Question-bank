import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import Navbar from './shared/components/Navbar';
import Profile from './user/pages/Profile';
import Login from './user/pages/Login';
import Signup from './user/pages/Signup';
import Questions from './questions/pages/Questions';
import NewQuestion from './questions/pages/NewQuestion';
import UpdateQuestion from './questions/pages/UpdateQuestion';
import Exams from './exams/pages/Exams';
import StudentExams from './exams/pages/StudentExams';
import TakeExam from './exams/pages/TakeExam';
import Notification from './notifications/pages/notification';

const App = () => {
  const { token, userId, userType, username, login, logout } = useAuth(); 
  
  const routes = !token ? 
    (
      <Routes>
        <Route path='/signup' element={ <Signup /> } />
        <Route path='/' element={ <Login /> } />
      </Routes>
    )
    : userType === 'SUPER_ADMIN' ?
    (
      <Routes>
        <Route path='/' element={ <Profile /> } />
        <Route path='/questions' element={ <Questions /> } />
        <Route path='/new-question' element={ <NewQuestion /> } />
        <Route path='/update-question/:questionId' element={ <UpdateQuestion /> } />
        <Route path='/create-admin' element={ <Signup /> } />
      </Routes>
    )
    : userType === 'TEACHER' || userType === 'ADMIN' ?
    (
      <Routes>
        <Route path='/' element={ <Profile /> } />
        <Route path='/questions' element={ <Questions /> } />
        <Route path='/new-question' element={ <NewQuestion /> } />
        <Route path='/update-question/:questionId' element={ <UpdateQuestion /> } />
        <Route path='/exams' element={ <Exams /> } />
        <Route path='/notifications' element={ <Notification /> } />
      </Routes>
    ) 
    : (
      <Routes>
        <Route path='/' element={ <Profile /> } />
        <Route path='/exams' element={ <StudentExams /> } />
        <Route path='/takeexam/:examId' element={ <TakeExam /> } />
        <Route path='/notifications' element={ <Notification /> } />
      </Routes>
    )
  ;
              
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        userId,
        username,
        userType,
        login,
        logout
      }}
    >
        <Navbar />
        <main>{routes}</main>
    </AuthContext.Provider>  
  )
}

export default App;