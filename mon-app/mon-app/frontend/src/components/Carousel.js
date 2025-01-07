import React, { useEffect, useState } from "react";
import "../styles/Carousel.css";

function Carousel() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // Pour gérer l'événement sélectionné
  const [reminderStates, setReminderStates] = useState({}); // Pour gérer l'état de chaque rappel individuellement

  useEffect(() => {
    // Récupération du token dans le Local Storage
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Vous devez être connecté pour voir les événements.");
      return;
    }

    // Appel à l'API avec le token dans l'en-tête
    fetch("http://127.0.0.1:8000/evenement/upcoming-events/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des événements.");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        // Initialiser l'état des rappels pour chaque événement
        const initialReminderStates = {};
        data.forEach((event) => {
          initialReminderStates[event.id] = false; // Par défaut, désactivé
        });
        setReminderStates(initialReminderStates);
      })
      .catch((error) => setError(error.message));
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event); // Affiche le modal avec les informations de l'événement
  };

  const closeModal = () => {
    setSelectedEvent(null); // Ferme le modal
  };

  const toggleReminder = (eventId) => {
    setReminderStates((prevStates) => ({
      ...prevStates,
      [eventId]: !prevStates[eventId],
    }));
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="carousel-container">
      {events.map((event) => (
        <div key={event.id} className="carousel-card">
          <img
            src={`http://127.0.0.1:8000${event.image}`}
            alt={event.intitulé}
            className="event-image"
            onClick={() => handleEventClick(event)} // Le clic est maintenant sur l'image uniquement
          />
          <div className="event-details">
            <h3>{event.intitulé}</h3>
            <p>{event.adresse}</p>
            <div className="reminder-container">
              <div
                className={`switch ${reminderStates[event.id] ? 'on' : 'off'}`}
                onClick={() => toggleReminder(event.id)}
              >
                <div className="switch-knob" />
              </div>
              <span>{reminderStates[event.id] ? 'Activé' : 'Désactivé'}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}
      {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedEvent.intitulé}</h2>
            <p>
              <strong>Date :</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Heure :</strong> {selectedEvent.heure}
            </p>
            <p>
              <strong>Adresse :</strong> {selectedEvent.adresse}
            </p>
            <p>
              <strong>Description :</strong> {selectedEvent.description}
            </p>
            {selectedEvent.image && (
              <img
                src={`http://127.0.0.1:8000${selectedEvent.image}`}
                alt={selectedEvent.intitulé}
                className="modal-image"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Carousel;
