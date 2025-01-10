import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/journal.css';
import axios from 'axios';

const TP = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState({
    SYNTHESE: [],
    RAPPORT_FINAL: [],
    RAPPORT_PING: [],
    PRESENTATION: []
  });
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: ''
  });

  const handleModifierClick = (type) => {
    // Mapper les types de documents aux routes
    const typeMapping = {
      'SYNTHESE': 'SYNTHESE',
      'RAPPORT_FINAL': 'RAPPORT_FINAL',
      'RAPPORT_PING': 'RAPPORT_PING',
      'PRESENTATION': 'PRESENTATION'
    };
    
    navigate(`/tp/documents/${typeMapping[type]}`);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tp/documents/');
        setDocuments(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    // Récupérer les informations stockées lors du login
    const userFirstName = localStorage.getItem('first_name');
    const userLastName = localStorage.getItem('last_name');
    console.log('Retrieved from localStorage:', { userFirstName, userLastName }); // Pour déboguer
    
    setUserInfo({
      first_name: userFirstName || '',
      last_name: userLastName || ''
    });
  }, []);

  return (
    <div className="tp-container">
      <div className="tp-content">
        {/* Barre de navigation supérieure */}
        <header className="top-nav">
          <div className="nav-left">
            <h1>Journal de formation</h1>
            <p>Welcome, {userInfo.first_name} {userInfo.last_name}!</p>
          </div>
          <div className="nav-right">
            <i className="icon-search"></i>
            <i className="icon-messages"></i>
            <i className="icon-notifications"></i>
            <i className="icon-menu"></i>
          </div>
        </header>

        {/* Menu latéral gauche */}
        <aside className="sidebar">
          <div className="profile-image">
            {/* Image de profil */}
          </div>
          <nav>
            <ul>
              <li>Accueil</li>
              <li>Mon Profil</li>
              <li>Notifications</li>
              <li>Ressources</li>
              <li>Messages</li>
            </ul>
          </nav>
          <div className="footer-links">
            <p>Sign Out</p>
            <p>Help</p>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="main-content">
          <div className="documents-grid">
            {/* Fiche de Synthèse */}
            <section className="document-section purple">
              <div className="section-header">
                <h2>Fiche de Synthèse</h2>
                <button className="see-all">See All</button>
              </div>
              <div className="document-content">
                <div className="document-icon synthesis"></div>
                <div className="action-buttons">
                  <button 
                    className="btn-modifier"
                    onClick={() => handleModifierClick('SYNTHESE')}
                  >
                    Modifier
                  </button>
                  <button className="btn-consulter">Consulter</button>
                </div>
              </div>
            </section>

            {/* Rapport Final */}
            <section className="document-section yellow">
              <div className="section-header">
                <h2>Rapport Final</h2>
                <button className="see-all">See All</button>
              </div>
              <div className="document-content">
                <div className="document-icon report"></div>
                <div className="action-buttons">
                  <button 
                    className="btn-modifier"
                    onClick={() => handleModifierClick('RAPPORT_FINAL')}
                  >
                    Modifier
                  </button>
                  <button className="btn-consulter">Consulter</button>
                </div>
              </div>
            </section>

            {/* Rapport PING */}
            <section className="document-section pink">
              <div className="section-header">
                <h2>Rapport PING</h2>
                <button className="see-all">See All</button>
              </div>
              <div className="document-content">
                <div className="document-icon ping"></div>
                <div className="action-buttons">
                  <button 
                    className="btn-modifier"
                    onClick={() => handleModifierClick('RAPPORT_PING')}
                  >
                    Modifier
                  </button>
                  <button className="btn-consulter">Consulter</button>
                </div>
              </div>
            </section>

            {/* Presentations */}
            <section className="document-section green">
              <div className="section-header">
                <h2>Presentations</h2>
                <button className="see-all">See All</button>
              </div>
              <div className="document-content">
                <div className="document-icon presentation"></div>
                <div className="action-buttons">
                  <button 
                    className="btn-modifier"
                    onClick={() => handleModifierClick('PRESENTATION')}
                  >
                    Modifier
                  </button>
                  <button className="btn-consulter">Consulter</button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TP;
