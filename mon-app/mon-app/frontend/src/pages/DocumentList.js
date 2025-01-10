import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import '../styles/DocumentList.css';

const DocumentList = () => {
  const { type } = useParams(); // Récupère le type de document (rapport_final, rapport_ping, etc.)
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]); // Liste des documents de l'apprenti
  const [noteDialog, setNoteDialog] = useState({
    isOpen: false,
    documentId: null,
    apprentiName: ''
  });
  const [note, setNote] = useState(''); // Note donnée
  const [commentaire, setCommentaire] = useState(''); // Commentaire

  // Fonction pour récupérer les documents du backend
  useEffect(() => {
    fetchDocuments();
  }, [type]);

  const fetchDocuments = async () => {
    try {
      console.log('Fetching documents for type:', type);
      const response = await axios.get(`http://127.0.0.1:8000/utilisateurs/api/documents/${type}/`); // Récupérer les documents pour le type spécifique
      console.log('Response:', response.data);
      setDocuments(response.data); // Mettre à jour l'état des documents
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
    }
  };

  // Fonction pour afficher la fenêtre de notation d'un document
  const handleCheckDocument = (documentId, apprentiName) => {
    setNoteDialog({
      isOpen: true,
      documentId,
      apprentiName
    });
  };

  // Fonction pour soumettre la note et les commentaires
  const handleSubmitNote = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/utilisateurs/api/documents/${noteDialog.documentId}/noter/`, {
        note: parseFloat(note),
        commentaires: commentaire
      });
      
      setNoteDialog({ isOpen: false, documentId: null, apprentiName: '' });
      setNote('');
      setCommentaire('');
      fetchDocuments(); // Recharger la liste des documents
    } catch (error) {
      console.error('Erreur lors de la notation:', error);
    }
  };

  // Fonction pour définir le titre du document selon son type
  const getDocumentTitle = () => {
    const titles = {
      'synthese': 'Rapport PING',
      'rapport_final': 'Rapport Final',
      'rapport_ping': 'Rapport PING',
      'presentation': 'Présentation'
    };
    return titles[type] || type; // Retourne le titre du document ou le type si inconnu
  };

  return (
    <div className="document-list">
      <div className="document-header">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <h2>{getDocumentTitle()}</h2>
        <div className="semester">Semestre 5</div>
      </div>

      <div className="documents-table">
        <table>
          <thead>
            <tr>
              <th style={{ width: '50px' }}></th>
              <th>NOM & PRÉNOM</th>
              <th>Fichier</th>
              <th>Date dépôt</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents && documents.map(doc => (
              <tr key={doc.id || `missing-${doc.apprenti.id}`} className="document-row">
                <td>
                  <input
                    type="checkbox"
                    checked={doc.est_valide || false}
                    onChange={() => handleCheckDocument(doc.id, `${doc.apprenti.prenom} ${doc.apprenti.nom}`)}
                    disabled={!doc.id}
                  />
                </td>
                <td>{doc.apprenti.nom} {doc.apprenti.prenom}</td>
                <td>
                  {doc.fichier ? (
                    <div className="file-cell">
                      <span>{doc.fichier.split('/').pop()}</span>
                      <button className="view-button" onClick={() => window.open(doc.fichier, '_blank')}>👁️</button>
                    </div>
                  ) : (
                    <span className="no-file">Aucun fichier</span>
                  )}
                </td>
                <td>{doc.date_creation ? new Date(doc.date_creation).toLocaleDateString() : 'Non déposé'}</td>
                <td>
                  {!doc.date_creation && <span className="relance">relance</span>}
                  {doc.est_valide && <span className="note">Note: {doc.note}/20</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fenêtre modale pour ajouter la note et le commentaire */}
      {noteDialog.isOpen && (
        <div className="note-dialog">
          <div className="dialog-content">
            <h3>Noter le document de {noteDialog.apprentiName}</h3>
            <input
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note sur 20"
            />
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Commentaire (optionnel)"
            />
            <div className="dialog-buttons">
              <button onClick={handleSubmitNote}>Valider</button>
              <button onClick={() => setNoteDialog({ isOpen: false, documentId: null, apprentiName: '' })}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
