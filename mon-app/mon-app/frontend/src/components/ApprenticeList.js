// src/components/ApprenticeList.js

import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; 
import AddOrUpdateTutoringTeamModal from './AddOrUpdateTutoringTeamModal';
import TrainingJournal from './TrainingJournal'; // Composant pour afficher le journal
import '../styles/ApprenticeList.css';

const ApprenticeList = ({ promotion }) => {
  const [apprentices, setApprentices] = useState([]);
  const [selectedApprentice, setSelectedApprentice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Récupérer les apprentis de la promotion
  const fetchApprentices = async () => {
    if (!promotion || !promotion.id) {
      console.warn('Promotion non définie ou ID manquant.');
      return;
    }

    try {
      const response = await axios.get(`api/promotions/${promotion.id}/apprentices/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      setApprentices(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des apprentis:', error);
    }
  };

  useEffect(() => {
    fetchApprentices();
  }, [promotion]);

  const handleOpenModal = (apprentice) => {
    setSelectedApprentice(apprentice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedApprentice(null);
    setIsModalOpen(false);
  };

  const handleRefreshApprentices = () => {
    fetchApprentices();
  };

  return (
    <div className="apprentice-list-container">
      <div className="apprentice-list-header">
        <h2>Apprentis de la Promotion: {promotion?.name || 'N/A'}</h2>
        <button className="add-button" onClick={() => handleOpenModal(null)}>
          + Ajouter/Mettre à Jour Équipe Tutoral
        </button>
      </div>
      <table className="apprentice-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Tuteur Pédagogique</th>
            <th>Maître d'Apprentissage</th>
            <th>Promotion</th>
          </tr>
        </thead>
        <tbody>
          {apprentices.map((apprentice) => (
            <tr key={apprentice.id}>
              <td>
                <button className="name-button" onClick={() => setSelectedApprentice(apprentice)}>
                  {apprentice.user?.last_name || 'N/A'}
                </button>
              </td>
              <td>{apprentice.user?.first_name || 'N/A'}</td>
              <td>{apprentice.user?.email || 'N/A'}</td>
              <td>{apprentice.tutor_name || 'N/A'}</td>
              <td>{apprentice.master_name || 'N/A'}</td>
              <td>{apprentice.promotion_name || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddOrUpdateTutoringTeamModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        apprentice={selectedApprentice}
        refreshApprentices={handleRefreshApprentices}
      />
      {selectedApprentice && (
        <TrainingJournal apprentice={selectedApprentice} onClose={() => setSelectedApprentice(null)} />
      )}
    </div>
  );
};

export default ApprenticeList;
