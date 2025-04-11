import React, { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from './firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationComponent = () => {
  const [notification, setNotification] = useState({title: '', body: ''});
  
  useEffect(() => {
    // Request notification permission when component mounts
    requestNotificationPermission();
    
    // Listen for foreground messages
    const unsubscribe = onMessageListener().then(payload => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body
      });
      
      toast.info(`${payload.notification.title}: ${payload.notification.body}`);
    });
    
    // Clean up listener
    return () => {
      unsubscribe.catch(err => console.error(err));
    };
  }, []);
  
  return (
    <div>
      <h2>Notifications</h2>
      <ToastContainer />
      {notification?.title && (
        <div className="notification-card">
          <h3>{notification?.title}</h3>
          <p>{notification?.body}</p>
        </div>
      )}
      <button onClick={requestNotificationPermission}>
        Enable Notifications
      </button>
    </div>
  );
};

export default NotificationComponent;