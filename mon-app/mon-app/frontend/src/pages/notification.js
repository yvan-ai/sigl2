import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get('/api/notifications/')
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error("Il y a eu une erreur!", error);
      });
  }, []);

  const handleNotificationClick = (id) => {
    // Logique pour marquer la notification comme lue
    axios.patch(`/api/notifications/${id}/`, { read: true })
      .then(() => {
        setNotifications(notifications.filter(notif => notif.id !== id));
      });
  };

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} onClick={() => handleNotificationClick(notification.id)}>
            <strong>{notification.message}</strong>
            <p>{new Date(notification.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
