import React, { useState } from 'react';
import { FaHome, FaUser, FaBell, FaBook, FaSignOutAlt, FaBars } from 'react-icons/fa';
import '../styles/VerticalNavbar.css'; // Assurez-vous que le chemin est correct

const VerticalNavbar = ({ onProfileClick }) => { // Recevoir la fonction via props
  const [isOpen, setIsOpen] = useState(true);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`vertical-navbar ${isOpen ? 'open' : 'closed'}`}>
      <button className="vertical-toggle-button" onClick={toggleNavbar}>
        <FaBars />
      </button>
      <div className="vertical-profile-section">
        <img src="/profile-picture.jpg" alt="Profile" className="vertical-profile-pic" />
        {isOpen && <h3>Coordinatrice</h3>}
      </div>
      <nav className="vertical-nav-links">
        
        <button className="vertical-nav-link profile-button" onClick={onProfileClick}>
          <FaUser className="vertical-icon" />
          {isOpen && <span>Profil</span>}
        </button>
        <a href="#" className="vertical-nav-link">
          <FaBell className="vertical-icon" />
          {isOpen && <span>Notifications</span>}
        </a>
        <a href="#" className="vertical-nav-link">
          <FaBook className="vertical-icon" />
          {isOpen && <span>Ressources</span>}
        </a>
      </nav>
      <div className="vertical-signout-section">
        <a href="/logout" className="vertical-nav-link signout-link">
          <FaSignOutAlt className="vertical-icon" />
          {isOpen && <span>Sign Out</span>}
        </a>
      </div>
    </div>
  );
};

export default VerticalNavbar;
