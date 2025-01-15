import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Download } from 'lucide-react';
import { getApprenticeJournal, downloadDocument, updateDocumentComment } from '../services/api';
import './ApprenticeJournal.css';
import VerticalNavbarEncadreur from '../components/VerticalNavbarEncadreur';

const ApprenticeJournal = () => {
  const { id } = useParams();
  const [journalData, setJournalData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingComments, setEditingComments] = useState({});

  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          throw new Error("Email introuvable. Veuillez vous reconnecter.");
        }
        const response = await getApprenticeJournal(id, email);
        setJournalData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchJournalData();
  }, [id]);

  const handleEditComment = (docType) => {
    setEditingComments({
      ...editingComments,
      [docType]: journalData.documents.find(doc => doc.type === docType)?.commentaire || ''
    });
  };

  const handleSaveComment = async (docType) => {
    try {
      const updatedComment = editingComments[docType];
      await updateDocumentComment(id, docType, updatedComment);
      setJournalData(prevData => ({
        ...prevData,
        documents: prevData.documents.map(doc => 
          doc.type === docType ? { ...doc, commentaire: updatedComment } : doc
        )
      }));
      setEditingComments(prev => ({ ...prev, [docType]: undefined }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du commentaire:', error);
      setError('Erreur lors de la sauvegarde du commentaire. Veuillez réessayer.');
    }
  };

  const handleDownload = async (documentUrl) => {
    try {
      const response = await downloadDocument(documentUrl);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documentUrl.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">Erreur : {error}</div>;
  }

  return (
    <div className="app-container">
      <VerticalNavbarEncadreur />
      <div className="content-container">
        <div className="journal-content">
          <h2 className="journal-title">Journal de Formation</h2>
          <div className="documents-section">
            <h3 className="documents-title">Documents déposés</h3>
            {journalData.documents.map((doc) => (
              <div key={doc.type} className="document-item">
                <div className="document-info">
                  <FileText className="document-icon" />
                  <div>
                    <p className="document-type">{doc.type}</p>
                    <p className="document-date">
                      {new Date(doc.date_publication).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="document-actions">
                  {editingComments[doc.type] !== undefined ? (
                    <>
                      <input
                        type="text"
                        value={editingComments[doc.type]}
                        onChange={(e) => setEditingComments({...editingComments, [doc.type]: e.target.value})}
                        className="comment-input"
                      />
                      <button onClick={() => handleSaveComment(doc.type)} className="save-button">Sauvegarder</button>
                    </>
                  ) : (
                    <>
                      <span className="document-comment">{doc.commentaire}</span>
                      <button onClick={() => handleEditComment(doc.type)} className="edit-button">Éditer</button>
                    </>
                  )}
                  <button onClick={() => handleDownload(doc.document)} className="download-button">
                    <Download className="download-icon" />
                    Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprenticeJournal;
