import React, { useEffect, useState, useRef } from "react";
import "../styles/Carousel.css";

function Carousel() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [isHovered, setIsHovered] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  // Chargement des événements
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Vous devez être connecté pour voir les événements.");
      return;
    }

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
      .then((data) => setEvents([...data, ...data])) // Dupliquez les événements pour l'effet infini
      .catch((error) => setError(error.message));
  }, []);

  // Animation du carrousel
  useEffect(() => {
    const cardWidth = carouselRef.current.querySelector('.carousel-card')?.clientWidth + 16; // Largeur de la carte avec espace
    const totalWidth = cardWidth * events.length;

    const interval = setInterval(() => {
      setCurrentPosition((prevPosition) => {
        const newPosition = prevPosition - 1;
        // Vérifie si on a dépassé la limite
        return newPosition <= -2 * totalWidth ? -totalWidth : newPosition;
      });
    }, 16); // Fréquence élevée pour une animation fluide

    return () => clearInterval(interval); // Nettoyer l'intervalle au démontage
  }, [events]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const handlePrevClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const handleNextClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  // Affichage d'erreur
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={carouselRef}
    >
      <div
        className="carousel-track"
        style={{
          transform: `translateX(${currentPosition}px)`,
          transition: isHovered ? "none" : "transform 0.1s ease-in-out",
        }}
      >
        {events.map((event, index) => (
          <div key={index} className="carousel-card">
            <img
              src={`http://127.0.0.1:8000${event.image}`}
              alt={event.intitulé}
              className="event-image"
              onClick={() => handleEventClick(event)}
            />
            <div className="event-details">
              <h3>{event.intitulé}</h3>
              <p>{event.adresse}</p>
              <button className="reminder-button">Rappel</button>
            </div>
          </div>
        ))}
        {/* Dupliquer les cartes à la fin pour l'effet infini */}
        {events.map((event, index) => (
          <div key={index + events.length} className="carousel-card">
            <img
              src={`http://127.0.0.1:8000${event.image}`}
              alt={event.intitulé}
              className="event-image"
            />
             <p>{event.adresse}</p>
             <button className="reminder-button">Rappel</button>
            {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <h2>{selectedEvent.intitulé}</h2>
            <p><strong>Date :</strong> {selectedEvent.date}</p>
            <p><strong>Heure :</strong> {selectedEvent.heure}</p>
            <p><strong>Adresse :</strong> {selectedEvent.adresse}</p>
            <p><strong>Description :</strong> {selectedEvent.description}</p>
            {selectedEvent.image && (
              <img src={`http://127.0.0.1:8000${selectedEvent.image}`} alt={selectedEvent.intitulé} className="modal-image" />
            )}
          </div>
        </div>
      )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
