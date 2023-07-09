import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';

import { AuthContext } from '../../shared/context/auth-context';
import Error from '../../shared/components/Error';
import NotificationsList from '../components/NotificationsList';


const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/api/notifications/getusernotifications', {
          headers: {
            authorization: `Bearer ${token}` 
          }
        });
        setNotifications(data.notifications);
      } catch (err) {
        setErrorMessage(err.response?.data?.message);
      }
    }; 
     fetchNotifications();
  }, []);

  if (!notifications.length) {
    return <h2 className='container'>No notifications available!</h2>
  }

  const clearError = () => {
    setErrorMessage(null);
  };

  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  };

  return (
    <NotificationsList
      notifications={notifications}
    /> 
  )
};

export default Notification;