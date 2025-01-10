// frontend/src/pages/notification.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/notification.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://127.0.0.1:8000/notifications/notifications/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setNotifications(response.data);
    })
    .catch(error => {
      console.error("Il y a eu une erreur!", error);
    });
  }, []);

  const toggleReadStatus = (id, currentStatus) => {
    const token = localStorage.getItem('token');

    axios.patch(`http://127.0.0.1:8000/notifications/notifications/${id}/`, { read: !currentStatus }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: !currentStatus } : notif
      ));
    });
  };

  return (
    <div className="notifications-container">
      <h3>Notifications</h3>
      <ul className="notifications-list">
        {notifications.map(notification => (
          <li 
            key={notification.id} 
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
          >
            <span className="envelope-icon" onClick={() => toggleReadStatus(notification.id, notification.read)}>
              {notification.read ? '📭' : '📪'}
            </span>
            <strong>{notification.message}</strong>
            <p>{new Date(notification.created_at).toLocaleString('fr-FR')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;