import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ajoutez l'importation d'axios
import '../styles/ProfilePage.css'; // Pour les styles spécifiques
import VerticalNavbar from '../components/VerticalNavbar';

const ProfilePage = () => {
  // État pour stocker les informations de la coordinatrice
  const [userData, setUserData] = useState({});

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
  console.log('userdata',userData)
  return (
    
    <div className="profile-page">
      <h1>Profile {userData.user_type || ''}</h1>
      <div className="profile-info">
        <div className="profile-field">
          <span className="field-label">Prénom:</span>
          <span className="field-value">{userData.first_name}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Nom:</span>
          <span className="field-value">{userData.last_name}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Email:</span>
          <span className="field-value">{userData.email}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Responsable cursus ?:</span>
          <span className="field-value">{userData.is_responsable_cursus? 'OUI': 'NON'}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Menbre de l'équipe académique ?:</span>
          <span className="field-value">{userData.is_staff ? 'OUI': 'NON'}</span>
        </div>
        {/* Ajoutez d'autres champs ici */}
      </div>
      
    </div>
  );
};

export default ProfilePage;
