import { fetchData } from './apiService';

// Récupérer les missions par promotion
export const getMissionsByPromotion = async (promotionId) => {
  return fetchData(`/api/promotions/${promotionId}/missions/`);
};
