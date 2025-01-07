import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CreateJournauxForm.css';
import '../styles/autocompletion.css';

function AutoCompleteInput({ apiUrl, placeholder, onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Effectuer la recherche lorsque la query change
  useEffect(() => {
    if (query.length > 0) {
      axios.get(apiUrl, {
        params: { search: query },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ajout du jeton d'authentification
        }
      })
        .then(response => {
          console.log("Données des suggestions:", response.data); // Log pour vérifier la structure des données
          if (Array.isArray(response.data)) {
            setSuggestions(response.data);
            setShowSuggestions(true);
          } else {
            setSuggestions([]); // Si la réponse n'est pas un tableau, videz les suggestions
            setShowSuggestions(false);
          }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des suggestions:", error);
          setSuggestions([]); // Vider les suggestions en cas d'erreur
          setShowSuggestions(false);
        });
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [query, apiUrl]);

  console.log('Token utilisé:', localStorage.getItem('token'));

  const handleSelect = (suggestion) => {
    const nom = suggestion.nom_groupe || suggestion.nom_semestre; // Choisit 'nom_groupe' si présent, sinon 'nom_semestre'
    setQuery(nom); // Met à jour l'input avec le nom correct
    setShowSuggestions(false);
    onSelect(suggestion); // Notifie le parent de la sélection
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(query.length > 0)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map(suggestion => (
            <li key={suggestion.id} onClick={() => handleSelect(suggestion)}>
              {suggestion.nom_groupe || suggestion.nom_semestre} {/* Assurez-vous d'utiliser le champ exact */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function JournalDeFormationForm() {
  const [groupe, setGroupe] = useState(null);
  const [semestre, setSemestre] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleCancel = () => {
    setIsFormVisible(false); // Change l'état pour masquer le formulaire
  };

  // Si isFormVisible est false, ne pas afficher le formulaire
  if (!isFormVisible) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (groupe && semestre) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert("Aucun token trouvé. Veuillez vous connecter.");
          return;
        }

        const response = await axios.post(
          'http://127.0.0.1:8000/utilisateurs/journaux/creer/',
          {
            groupe_id: groupe.numero,
            semestre_id: semestre.id,
          }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}` // Ajout du jeton d'authentification
            }
          }
        );

        console.log('Token utilisé creer:', localStorage.getItem('token'));
        console.log(token);
        alert(response.data.message);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Authentification requise. Veuillez vous connecter.");
        } else if (error.response) {
          console.error('Erreur du serveur :', error.response.data);
          alert("Erreur : " + (error.response.data.detail || "Une erreur est survenue."));
        } else {
          console.error("Erreur réseau ou autre :", error.message);
          alert("Erreur réseau. Veuillez réessayer.");
        }
      }
    } else {
      alert("Veuillez sélectionner un groupe et un semestre valides.");
    }

    console.log("Données envoyées :", {
      groupe_id: groupe?.numero,
      semestre_id: semestre?.id,
    });
  };

  return (
    <div className="overlay"> 
    <form onSubmit={handleSubmit} className="journal-formation-form">
      <button className="close-btn" onClick={handleCancel}>&times;</button> {/* Bouton de fermeture */}
      <h2>Créer un Journal de Formation</h2>
      <label>
        Nom du groupe
        <AutoCompleteInput
          apiUrl="http://127.0.0.1:8000/utilisateurs/GroupesAutoCompletionView/"
          placeholder="Rechercher un groupe"
          onSelect={setGroupe}
        />
      </label>
      <label>
        Nom du semestre
        <AutoCompleteInput
          apiUrl="http://127.0.0.1:8000/utilisateurs/SemestresAutoCompletionView/"
          placeholder="Rechercher un semestre"
          onSelect={setSemestre}
        />
      </label>
      <div className="actions">
        <button type="submit">Créer Journal de Formation</button>
      </div>
    </form>
    </div>
  );
}

export default JournalDeFormationForm;
