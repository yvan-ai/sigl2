import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddUser.css';

function InviteUserForm() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [isResponsableCursus, setIsResponsableCursus] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    
    const handleNomChange = (e) => {
        setNom(e.target.value);
    };

    const handlePrenomChange = (e) => {
        setPrenom(e.target.value);
    };

    const handleResponsableChange = (e) => {
        setIsResponsableCursus(e.target.checked);
    };

    const handleCancel = () => {
        setIsFormVisible(false); // Change l'état pour masquer le formulaire
    };

    // Si isFormVisible est false, ne pas afficher le formulaire
    if (!isFormVisible) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/utilisateurs/add-user/', { 
                email, 
                user_type: role, 
                first_name: nom,  // Pass les valeurs des champs nom et prénom
                last_name: prenom,
                is_responsable_cursus: isResponsableCursus
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // Ajout du jeton d'authentification
                }
            });
            setMessage("Invitation envoyée avec succès!");
        } catch (error) {
            if (error.response) {
                // La requête a été faite et le serveur a répondu avec un code d'état
                console.error('Le serveur a répondu avec le code :', error.response.status);
                console.error('Données de l\'erreur:', error.response.data);
                setMessage("Erreur: " + error.response.data);
            } else if (error.request) {
                // La requête a été faite mais il n'y a pas eu de réponse
                console.error('Aucune réponse reçue:', error.request);
                setMessage("Erreur: Pas de réponse du serveur");
            } else {
                // Un problème s'est produit lors de la configuration de la requête
                console.error('Erreur de requête:', error.message);
                setMessage("Erreur: " + error.message);
            }
        }
    };

    return (
        <div className="overlay">
        <div className="invite-user-form">
            <button className="close-btn" onClick={handleCancel}>&times;</button> {/* Bouton de fermeture */}
            <h2>Inviter un nouvel utilisateur</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Role
                    <select value={role} onChange={handleRoleChange} required>
                        <option value="">Sélectionner un rôle</option>
                        <option value="1">Admin</option>
                        <option value="2">Apprenti</option>
                        <option value="4">Enseignant</option>
                        <option value="5">Maitre d'apprentissage</option>
                        <option value="6">Coordinatrice</option>
                    </select>
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Entrez l'email"
                        required
                    />
                </label>

                <label>
                    Nom
                    <input
                        type="text"
                        value={nom}
                        onChange={handleNomChange}
                        placeholder="Entrez le nom"
                        required
                    />
                </label>

                <label>
                    Prénom
                    <input
                        type="text"
                        value={prenom}
                        onChange={handlePrenomChange}
                        placeholder="Entrez le prénom"
                        required
                    />
                </label>
                <label>
                    Responsable Cursus
                    <input
                        type="checkbox"
                        checked={isResponsableCursus}
                        onChange={handleResponsableChange}
                    />
                </label>

                <div className="actions">
                    <button type="button" className="cancel-btn" onClick={handleCancel}>ANNULER</button>
                    <button type="submit" className="send-invitation-btn">ENVOYER INVITATION</button>
                </div>
            </form>

            {message && <p>{message}</p>}
        </div>
        </div>
    );
}

export default InviteUserForm;
