import React, { useEffect, useState } from "react";
import "../styles/addEvent.css";

const EventList = () => {
  const [events, setEvents] = useState([]);

  // Fonction pour récupérer les événements depuis le backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/evenement/events/");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error("Erreur lors de la récupération des événements :", response.statusText);
        }
      } catch (error) {
        console.error("Erreur de connexion :", error.message);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container">
      <h1>Liste des événements</h1>
      {events.length === 0 ? (
        <p>Aucun événement trouvé.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.intitule}</h3> {/* Correction du champ "intitulé" -> "intitule" */}
            <p>
              <strong>Lieu : </strong> {event.adresse}
            </p>
            <p>
              <strong>Date : </strong> {event.date} <strong>Heure : </strong> {event.heure}
            </p>
            {event.image && (
              <img
                src={`http://127.0.0.1:8000${event.image}`}
                alt={event.intitule}
                className="event-image-preview"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default EventList;
