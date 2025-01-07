import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/uploadForm.css'; // Fichier CSS pour styliser l'interface
import { FaPaperclip } from 'react-icons/fa'; // Icône pour le fichier attaché

const UploadForm = () => {
    const [documentType, setDocumentType] = useState('');
    const [commentaire, setCommentaire] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [journalId, setJournalId] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // État pour gérer le chargement

    // Récupérer le journal_id de l'utilisateur en cours
    useEffect(() => {
        const fetchJournalId = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/apprentis/journal/current/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setJournalId(response.data.journal_id);
            } catch (error) {
                setMessage('Impossible de récupérer le journal de formation.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchJournalId();
    }, []);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : '');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Document Type:", documentType);
        console.log('Token utilisé:', localStorage.getItem('token'));
        if (!journalId) {
            setMessage('Journal non défini. Veuillez réessayer plus tard.');
            return;
        }

        if (!documentType || !commentaire || !file) {
            setMessage('Veuillez remplir tous les champs');
            return;
        }
        console.log("Document Type(2):", documentType);
        const formData = new FormData();
        formData.append('type_document', documentType);
        formData.append('commentaire', commentaire);
        formData.append('document_file', file);

        try {
            setIsSubmitting(true);
            const response = await axios.post(`http://127.0.0.1:8000/apprentis/journal/${journalId}/deposer/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            

            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Erreur lors du dépôt du fichier');
        } finally {
            setIsSubmitting(false);
        }
    };
    if (isLoading) {
        return <p>Chargement...</p>; // Afficher un état de chargement pendant la récupération de l'ID
    }

    return (
        <div className='overlay'>
        <div className="upload-form-container" >
            <div className="sidebar">
                <div className="nav-links">
                    <a href="#">Home</a>
                    <a href="#">Help</a>
                </div>

                <h1>Nouveau document</h1>
                <p>We're here to help you!</p>
            </div>

            <div className="form-section">
                <div className="text-depot">
                    DÉPÔT
                    <span className="icon">📁</span> 
                </div>
                <form onSubmit={handleSubmit} className="upload-form">
                    <label>Catégorie de documents</label>
                    <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} required>
                        <option value="">Select type de document</option>
                        <option value='fiche_synthese'>Fiche de synthèse</option>
                        <option value="ping">Rapport ping</option>
                        <option value="rapport_final">Rapport final</option>
                        <option value="presentation">Support de presentation</option>
                    </select>

                    <label>Commentaires :</label>
                    <textarea
                        value={commentaire}
                        onChange={(e) => setCommentaire(e.target.value)}
                        placeholder="Ajouter un commentaire"
                        required
                    ></textarea>

                    <label>Pièce jointe :</label>
                    <div className="upload-container">
                        <label htmlFor="file-upload" className="custom-file-upload">
                            <span className="plus-icon">+</span>
                        </label>
                        <input id="file-upload" type="file" onChange={handleFileChange} />
                        {fileName && (
                            <div className="file-info">
                                <FaPaperclip className="file-icon" /> {fileName}
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={isSubmitting}>Soumettre</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
        </div>
    );
};

export default UploadForm;
