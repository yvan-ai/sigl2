
import { FaHome, FaUser, FaBell, FaBook, FaSignOutAlt, FaBars } from 'react-icons/fa';
import '../styles/VerticalNavbar.css'; // Assurez-vous que le chemin est correct
import axios from 'axios';
import React, { useEffect, useState } from 'react'; 
import profilImage from '../images/profil.jpg';
import ProfilePage from './ProfilePage';
import { useNavigate } from 'react-router-dom'; 
import Notifications from '../pages/notification';



const VerticalNavbar = ({ onProfileClick }) => { // Recevoir la fonction via props
  const [isOpen, setIsOpen] = useState(true);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  
  // Récupération du token dans le Local Storage
  const token = localStorage.getItem("token");

 

  // Fonction pour récupérer les données de l'utilisateur connecté
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/utilisateurs/api/user/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
    }
  };

  // Charger les données utilisateur au chargement du composant
  useEffect(() => {
    fetchUserProfile();
  }, []);
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  const handleProfileClick = () => {
    navigate('/profile-views');  // Redirection vers /profile
  };
  const handleNotificationClick = () => {
    navigate('/notifications');  // Redirection vers /notifications
  };
  

  return (
    <div className={`vertical-navbar ${isOpen ? 'open' : 'closed'}`}>
      <button className="vertical-toggle-button" onClick={toggleNavbar}>
        <FaBars />
      </button>
      <div className="vertical-profile-section">
        <img src={profilImage} alt='profile' className="vertical-profile-pic" />
        {isOpen && (
          <>
            <p>{userData.user_type || ''}</p>
            <h3>{`${userData.first_name || ''} ${userData.last_name || ''}`}</h3>
            
          </>
        )}
      </div>
      <nav className="vertical-nav-links">
        
        <button className="vertical-nav-link profile-button" onClick={handleProfileClick}>
          <FaUser className="vertical-icon" />
          {isOpen && <span>Profil</span>}
        </button>
        <a href="/notifications" className="vertical-nav-link">
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
