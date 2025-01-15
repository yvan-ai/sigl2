import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getApprentices } from '../services/api';
import VerticalNavbarEncadreur from '../components/VerticalNavbarEncadreur';
import './ApprenticesList.css';

const ApprenticesList = () => {
  const navigate = useNavigate();
  const [apprentices, setApprentices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprentices = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          throw new Error('Email de l\'utilisateur non trouvé');
        }
        const response = await getApprentices(email);
        setApprentices(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
  
    fetchApprentices();
  }, []);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error"><AlertCircle /> {error}</div>;
  }

  return (
    <div className="app-container">
      <VerticalNavbarEncadreur />
      <div className="content-container">
        <div className="apprentices-list">
          <h2>Mes Apprentis</h2>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>État</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apprentices.map((apprentice) => (
                <tr key={apprentice.id}>
                  <td>{apprentice.first_name}</td>
                  <td>{apprentice.last_name}</td>
                  <td>
                    {apprentice.status ? (
                      <span className="status deposited"><CheckCircle /> Déposé</span>
                    ) : (
                      <span className="status not-deposited"><XCircle /> Non déposé</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => navigate(`/journal/${apprentice.id}`)}>
                      <FileText /> Consulter le journal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApprenticesList;
