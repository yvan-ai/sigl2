// src/components/TutoratTable.js
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; 
import AddTutorModal from './AddTutorModal';
import '../styles/TutoratTable.css'; // Fichier de styles spécifique
import { getTutors, getMasters, getApprentices } from '../api/coordinatorApi';

const TutoratTable = () => {
  const [tutors, setTutors] = useState([]);
  const [masters, setMasters] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [filteredMasters, setFilteredMasters] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchPromotion, setSearchPromotion] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Récupérer les tuteurs et maîtres d'apprentissage depuis le backend
  //const fetchTutors = async () => {
    //try {
     // const response = await axios.get('/api/list-tutors/', {
      //  headers: {
      //    Authorization: `Bearer ${localStorage.getItem('access')}`,
      //  },
     // });
     // setTutors(response.data);
    //  setFilteredTutors(response.data);
   // } catch (error) {
   //   console.error('Erreur lors de la récupération des tuteurs:', error);
  //  }
 // };

    const fetchTutors = async () => {
      try {
        const response = await axios.get('/api/list-tutors/', {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
        });
        //const data = await getTutors();
        setTutors(response.data);
        setFilteredTutors(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des Tuteurs :', error);
      }
    };

  const fetchMasters = async () => {
    try {
      const response = await axios.get('/api/list-masters/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      setMasters(response.data);
      setFilteredMasters(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des maîtres:', error);
    }
  };

  useEffect(() => {
    fetchTutors();
    fetchMasters();
  }, []);

  // Fonction de filtrage
  useEffect(() => {
    const filterTutors = tutors.filter((tutor) => {
      const fullName = `${tutor.professor.first_name} ${tutor.professor.last_name}`.toLowerCase();
      const promotion = tutor.professor.promotion
        ? tutor.professor.promotion.toLowerCase()
        : '';
      return (
        fullName.includes(searchName.toLowerCase()) &&
        promotion.includes(searchPromotion.toLowerCase())
      );
    });
    setFilteredTutors(filterTutors);

    const filterMasters = masters.filter((master) => {
      const fullName = `${master.first_name} ${master.last_name}`.toLowerCase();
      const promotion = master.promotion
        ? master.promotion.toLowerCase()
        : '';
      return (
        fullName.includes(searchName.toLowerCase()) &&
        promotion.includes(searchPromotion.toLowerCase())
      );
    });
    setFilteredMasters(filterMasters);
  }, [searchName, searchPromotion, tutors, masters]);

  // Fonction pour rafraîchir les données après ajout
  const refreshData = () => {
    fetchTutors();
    fetchMasters();
  };

  return (
    <div className="tutorat-container">
      <div className="tutorat-header">
        <h2>Tuteurs et Maîtres d'Apprentissage</h2>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          + Ajouter
        </button>
      </div>
      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rechercher par promotion..."
          value={searchPromotion}
          onChange={(e) => setSearchPromotion(e.target.value)}
        />
      </div>
      <table className="tutorat-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Rôle</th>
            <th>Promotion</th>
            <th>Apprentis</th>
            <th>Entreprise</th>    
          </tr>
        </thead>
        <tbody>
          {filteredTutors.sort((a, b) => a.professor.last_name.localeCompare(b.professor.last_name)).map((tutor) => (
            <tr key={tutor.id}>
              <td>{`${tutor.professor.full_name}`}</td>
              <td>Tuteur Pédagogique</td>
              <td>{tutor.promotions || 'N/A'}</td>
              <td>{tutor.apprentices.user_name}</td>
              <td>'N/A'</td>
            </tr>
          ))}
          {filteredMasters.sort((a, b) => a.last_name.localeCompare(b.last_name)).map((master) => (
            <tr key={master.id}>
              <td>{`${master.user}`}</td>
              <td>Maître d'Apprentissage</td>
              <td>{master.promotions || 'N/A'}</td>
              <td>{master.apprentices.user_name}</td>
              <td>{master.company ? master.company.name : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddTutorModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        refreshData={refreshData}
      />
    </div>
  );
};

export default TutoratTable;
