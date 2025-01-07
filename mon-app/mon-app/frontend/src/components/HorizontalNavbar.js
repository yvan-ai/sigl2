// src/components/HorizontalNavbar.js
import React from 'react';
import '../styles/HorizontalNavbar.css'; // Assurez-vous que le chemin est correct

const HorizontalNavbar = ({ onHomeClick, onTutoratClick, onApprentisClick }) => { // Ajouter onApprentisClick
  return (
    <div className="horizontal-navbar">
      <nav className="horizontal-nav-links">
        <button className="horizontal-nav-link home-button" onClick={onHomeClick}>
          Accueil
        </button>
        <button className="horizontal-nav-link tutoral-button" onClick={onTutoratClick}>
          Tutorat
        </button>
        <button className="horizontal-nav-link apprentis-button" onClick={onApprentisClick}>
          Apprentis
        </button>
        <a href="#" className="horizontal-nav-link">
          Entreprises
        </a>
        <a href="#" className="horizontal-nav-link">
          Evènements
        </a>
      </nav>
    </div>
  );
};

export default HorizontalNavbar;
