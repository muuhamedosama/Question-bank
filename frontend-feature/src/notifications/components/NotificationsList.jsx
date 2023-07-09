import React, { useState } from 'react';

import Error from '../../shared/components/Error';
import NotificationItem from './NotificationItem';
import './NotificationList.css';

const NotificationsList = ({ notifications }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const clearError = () => {
    setErrorMessage(null);
  };
  
  if (errorMessage) {
    return <Error message={errorMessage} clearError={clearError} />
  }

  return (
    <div className='notification-list'>
      { notifications.map(notification => 
        <NotificationItem 
          key={notification._id}
          notification={notification}
        />
      )}
    </div>
  )
};

export default NotificationsList;