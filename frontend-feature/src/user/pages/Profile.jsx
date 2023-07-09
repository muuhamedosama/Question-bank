import React, { useContext } from 'react';

import { AuthContext } from '../../shared/context/auth-context';

import './Profile.css'

const Profile = () => {
  const { username, userType } = useContext(AuthContext);

  return (
    <div className='profile'>
      <h1>Username: {username}</h1>
      <h3>UserType: {userType}</h3>
    </div>
  )
}

export default Profile;