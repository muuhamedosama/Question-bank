import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ notification }) => {  
  const navigate = useNavigate();

  const currentTime = new Date();
  const notificationTimestamp = new Date(notification.createdAt);

  const notificationTime = notificationTimestamp.getTime();
  const currentTimeInMillis = currentTime.getTime();

  const timeDifferenceInMillis = currentTimeInMillis - notificationTime;

  const seconds = Math.floor(timeDifferenceInMillis / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const time = hours % 24 === 0 
    ? `${minutes % 60} mins ago`
    : `${hours} hours, ${minutes % 60} mins ago`
    
  return (
    <div onClick={() => navigate('/exams')} className='notification-item container'>
      <div className='message'>
        {notification.message}
      </div>
      <div className='timestamp'>
        {time}
      </div>
    </div>
  )
};

export default NotificationItem;