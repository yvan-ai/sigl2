import axios from 'axios';

/////////////////////////THEO//////////////////////////////////////////////////
const BASE_URL = 'http://localhost:8000/utilisateurs';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/token/`, {
      email,
      password,
    });

    // Enregistrer le token dans localStorage
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('userType', response.data.user_type);


    return response.data; // Retourne les tokens ou l'utilisateur connecté
  } catch (error) {
    // Relance une erreur pour que le composant puisse la capturer
    throw error.response?.data?.detail || 'Erreur de connexion';
  }
};
//deconnexion et suppresion token
export const logout = () => {
  // Supprime les données du localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userType');
};

////////////////////////////THEO/////////////////////////////////

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
        const { access } = response.data;
        localStorage.setItem('token', access);
        api.defaults.headers['Authorization'] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Erreur lors du rafraîchissement du token:', refreshError);
        // Rediriger vers la page de connexion ou gérer l'erreur
      }
    }
    return Promise.reject(error);
  }
);

export const getApprentices = (email) => api.get(`/utilisateurs/apprentis/?email=${email}`);

export const getApprenticeJournal = (id, email) => api.get(`/utilisateurs/apprentis/${id}/journal/?email=${email}`);

export const downloadDocument = (url) => api.get(url, { responseType: 'blob' });



export const updateDocumentComment = (id, documentType, comment) => {
  const email = localStorage.getItem('userEmail');
  if (!id || !documentType || !comment || !email) {
    console.error('Paramètres manquants pour updateDocumentComment');
    return Promise.reject('Paramètres manquants');
  }
  return api.patch(`/utilisateurs/apprentis/${id}/document/`, 
    { document_type: documentType, comment },
    { params: { email } }
  );
};

export default api;
