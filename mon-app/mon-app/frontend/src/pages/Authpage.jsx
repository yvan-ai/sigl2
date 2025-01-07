import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BottomBar from "../components/BottomBar"; // Chemin relatif au fichier

import "../styles/AuthPage.css";
import { login } from '../services/api';


const AuthPage = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [userType, setUserType] = useState(localStorage.getItem('userType'));
      
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const response = await axios.post('http://localhost:8000/utilisateurs/api/token/', {
          email: email,
          password: password,
          
        }
       
        );
      
        console.log('Réponse de l\'API:', response.data);  // Ajoute cette ligne pour inspecter les données renvoyées

        //alert('Connexion réussie : ' + JSON.stringify(response));
    
        // Stockage du token d'accès et du token de rafraîchissement
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('userEmail', email);
    
        // Stocker le type d'utilisateur
        localStorage.setItem('userType', response.data.user_type);
        
        setToken(response.data.access);
    
        // Redirection basée sur user_type
        switch (response.data.user_type) {
          case 1:
            navigate('/AdminDashboard');
            break;
          case 2:
            navigate('/ApprentiDashboard');
            break;
          case 3:
            navigate('/TutorDashboard');
            break;
          case 4:
            navigate('/EnseignantDashboard');
            break;
          case 5:
            navigate('/MaitreDashboard');
            break;
          case 6:
            navigate('/CoordinatorDashboard');
            break;
          case 7:
            navigate('/EntrepriseDashboard');
            break;
          default:
            navigate('/');
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.detail) {
          setError(err.response.data.detail); // Message d'erreur lisible depuis l'API
        } else {
          setError('Erreur inattendue. Veuillez réessayer.');
        }
      }
    };
    
  
    return (
        <div className="auth-page">
            <div className="auth-left">
                <div className="auth-content">
                    <h1>WELCOME BACK</h1>
                    <p>
                        Nice to see you again. Login to continue accessing your account.
                    </p>
                </div>
            </div>
            <div className="auth-right">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Login Account</h2>
                    <div className="input-group">
                        <label>Email ID</label>
                        <input type="email" 
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" 
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                    </div>
                    <div className="auth-options">
                        <label>
                            <input type="checkbox" /> Keep me signed in
                        </label>
                        <a href="#forgot-password">Forgot password?</a>
                    </div>
                    <button type="submit" className="btn-submit">Login</button>
                    {error && <p>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default AuthPage;


//url.py, views.py, 