// src/components/Calendar.js  
import React, { useState } from 'react';

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import '../styles/CalendarStyles.css'; // Chemin ajusté // Vous pouvez créer un fichier CSS pour personnaliser le style

const CustomCalendar = ({ unavailableDates }) => {
    const [value, setValue] = useState(new Date());

    // Fonction pour vérifier si une date est indisponible  
    const tileClassName = ({ date }) => {
        const formattedDate = date.toISOString().split('T')[0];
        if (unavailableDates.includes(formattedDate)) {
            return 'unavailable';
        }
        // Vous pouvez ajouter d'autres conditions ici si nécessaire  
        return null;
    };

    return (
        <div>
            <Calendar  
                onChange={setValue}
                value={value}
                tileClassName={tileClassName}
                // D'autres props peuvent être ajoutées ici  
            />
        </div>
    );
};

export default CustomCalendar;