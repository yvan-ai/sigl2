// src/frontend/pages/Apprenti.js  
import React, { useEffect, useState } from 'react';
import '../styles/Apprenti.css'; // Chemin corrigé vers Apprenti.css  
import CustomCalendar from '../components/Calendar'; // Assurez-vous que le chemin est correct
import axios from 'axios';
import EventForm from '../components/EventForm';
import Carousel from '../components/Carousel';
import { Link } from 'react-router-dom';

import VerticalNavbar from '../components/VerticalNavbar';


const Apprenti = () => {
  // Définir les dates indisponibles pour le calendrier  
  const unavailableDates = [
      new Date(2023, 9, 5),  // 5 octobre 2023  
      new Date(2023, 9, 10), // 10 octobre 2023  
  ];

  // eslint-disable-next-line no-unused-vars
  const [apprentiData, setApprentiData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [events, setEvents] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [calendarDates, setCalendarDates] = useState([]);

  useEffect(() => {
    const fetchApprentiData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/apprentis/me/');
        setApprentiData(response.data);
        
        const eventsResponse = await axios.get('http://localhost:8000/api/apprenti/events/');
        setEvents(eventsResponse.data);
        
        const calendarResponse = await axios.get('http://localhost:8000/api/apprenti/calendar/');
        setCalendarDates(calendarResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchApprentiData();
  }, []);

  return (
    <div className="apprenti-container">
      <div className="apprenti-content">
        {/* Barre de navigation supérieure */}
      

        {/* Menu latéral gauche */}
        <VerticalNavbar />

        {/* Contenu principal */}
        <main className="main-content">
          <section className="event-section">
          <Carousel/>
          </section>

          <section className="calendar-section">
            <h2>Mon Calendrier</h2>
            <CustomCalendar unavailableDates={unavailableDates} /> {/* Passer les dates indisponibles */}
          </section>

          <section className="journal-section">
            <h2>Journal de formation</h2>
            <div className="journal-icon"></div> {/* Image représentant un journal */}
            <div className="action-buttons">
            
              <button className="btn-consult">
                Consulter
              </button>
              <Link to="/upload">
              <button className="btn-new-doc">Nouveau doc</button></Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Apprenti;