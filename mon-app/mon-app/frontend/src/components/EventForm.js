import React, { useState } from "react";
import "../styles/addEvent.css";

const EventForm = ({ onEventCreated }) => {
  const [formData, setFormData] = useState({
    date: "",
    heure: "",
    adresse: "",
    intitule: "", // Correspond au champ utilisé dans l'API
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Ajout d'un message d'erreur
  const [isFormVisible, setIsFormVisible] = useState(true);
  // Fonction pour gérer les modifications du formulaire
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      setPreviewImage(URL.createObjectURL(files[0]));
      setFormData((prev) => ({
        ...prev,
        [name]: files[0], // Sauvegarde le fichier directement
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleCancel = () => {
    setIsFormVisible(false); // Change l'état pour masquer le formulaire
};
// Si isFormVisible est false, ne pas afficher le formulaire
if (!isFormVisible) {
  return null;
}

  // Fonction pour envoyer les données au backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification si tous les champs sont remplis
    if (!formData.intitulé || !formData.date || !formData.heure) {
      setErrorMessage("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    // Création de l'objet FormData
    const data = new FormData();
  
    // Ajouter les données du formulaire à l'objet FormData
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    // Récupérer le jeton d'authentification du stockage local
    
    const token = localStorage.getItem("token");
    console.log(localStorage.getItem("token"));

    if (!token) {
      setErrorMessage("Utilisateur non authentifié. Veuillez vous connecter.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/evenement/events/", {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`, // Inclure le jeton ici
        },
      },{
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`  // Ajout du jeton d'authentification
        }
    });

      if (response.ok) {
        //onEventCreated(); // Notifier que l'événement a été créé avec succès
        alert("Événement créé avec succès !");
      } else {
        const errorData = await response.json();
        setErrorMessage("Erreur : " + JSON.stringify(errorData));
      }
    } catch (error) {
      setErrorMessage("Erreur de connexion : " + error.message);
    }
  };

  return (
    <div className="overlay">
    
    <div className="container">
      
    <button className="close-btn" onClick={handleCancel}>&times;</button> 

    <h1>Créer un événement</h1> 
      <form onSubmit={handleSubmit}>
        {previewImage && (
          <img src={previewImage} alt="Prévisualisation" className="event-image-preview" />
        )}

        <label htmlFor="intitule">Nom de l'événement</label>
        
        <input
          type="text"
          id="intitulé"
          name="intitulé"
          placeholder="Nom de l'événement"
          onChange={handleChange}
          required
        />

        <label htmlFor="adresse">Lieu</label>
        <input
          type="text"
          id="adresse"
          name="adresse"
          placeholder="Lieu"
          onChange={handleChange}
        />

        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          onChange={handleChange}
          required
        />

        <label htmlFor="heure">Heure</label>
        <input
          type="time"
          id="heure"
          name="heure"
          onChange={handleChange}
          required
        />

        <label htmlFor="image">Photo de l'événement</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleChange}
        />

        <button type="submit">Créer un événement</button>
      </form>

      {/* Afficher un message d'erreur s'il y en a */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
    </div>
  );
};

export default EventForm;
