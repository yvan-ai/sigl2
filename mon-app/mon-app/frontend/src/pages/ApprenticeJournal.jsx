import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Download } from 'lucide-react';
import { getApprenticeJournal, downloadDocument, updateDocumentComment } from '../services/api';
import './ApprenticeJournal.css';
import UploadForm from '../components/uploadForm';

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
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Journal de Formation</h2>
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Documents déposés
          </h3>
          {journalData.documents.map((doc) => (
            <div key={doc.type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.type}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(doc.date_publication).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {editingComments[doc.type] !== undefined ? (
                  <>
                    <input
                      type="text"
                      value={editingComments[doc.type]}
                      onChange={(e) => setEditingComments({...editingComments, [doc.type]: e.target.value})}
                      className="border rounded px-2 py-1"
                    />
                    <button onClick={() => handleSaveComment(doc.type)} className="text-green-600">Sauvegarder</button>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-500 max-w-md truncate">
                      {doc.commentaire}
                    </span>
                    <button onClick={() => handleEditComment(doc.type)} className="text-blue-600">Éditer</button>
                  </>
                )}
                <button
                  onClick={() => handleDownload(doc.document)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Télécharger
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApprenticeJournal;