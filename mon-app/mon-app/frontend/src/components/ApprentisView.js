// src/components/ApprentisView.js
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; 
import AddPromotionModal from './AddPromotionModal';
import UpdatePromotionModal from './UpdatePromotionModal';
import '../styles/ApprentisView.css';
import ApprenticeList from './ApprenticeList'; // Composant pour afficher les apprentis

const ApprentisView = () => {
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [promotionToUpdate, setPromotionToUpdate] = useState(null);

  // Récupérer les promotions depuis le backend
  const fetchPromotions = async () => {
    try {
      const response = await axios.get('/api/promotions/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      setPromotions(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des promotions:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleAddPromotion = () => {
    setIsAddModalOpen(true);
  };

  const handleUpdatePromotion = (promotion) => {
    setPromotionToUpdate(promotion);
    setIsUpdateModalOpen(true);
  };

  const handleDeletePromotion = async (promotion_id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion?')) return;

    try {
      await axios.delete(`/api/promotions/${promotion_id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      fetchPromotions();
    } catch (error) {
      console.error('Erreur lors de la suppression de la promotion:', error);
      alert('Erreur lors de la suppression de la promotion.');
    }
  };

  const handleSelectPromotion = (promotion) => {
    setSelectedPromotion(promotion);
  };

  return (
    <div className="apprentis-container">
      {!selectedPromotion ? (
        <div>
          <div className="apprentis-header">
            <h2>Promotions</h2>
            <button className="add-button" onClick={handleAddPromotion}>
              + Ajouter Promotion
            </button>
          </div>
          <table className="apprentis-table">
            <thead>
              <tr>
                <th>Nom de la Promotion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => (
                <tr key={promotion.id}>
                  <td>
                    <button className="promotion-name-button" onClick={() => handleSelectPromotion(promotion)}>
                      {promotion.name}
                    </button>
                  </td>
                  <td>
                    <button className="edit-button" onClick={() => handleUpdatePromotion(promotion)}>
                      Modifier
                    </button>
                    <button className="delete-button" onClick={() => handleDeletePromotion(promotion.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <AddPromotionModal
            isOpen={isAddModalOpen}
            onRequestClose={() => setIsAddModalOpen(false)}
            refreshPromotions={fetchPromotions}
          />
          {promotionToUpdate && (
            <UpdatePromotionModal
              isOpen={isUpdateModalOpen}
              onRequestClose={() => setIsUpdateModalOpen(false)}
              promotion={promotionToUpdate}
              refreshPromotions={fetchPromotions}
            />
          )}
        </div>
      ) : (
        <ApprenticeList promotion={selectedPromotion} />
      )}
    </div>
  );
};

export default ApprentisView;
