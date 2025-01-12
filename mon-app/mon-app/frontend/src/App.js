import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/login';
import ApprenticesList from './pages/ApprenticesList';
import ApprenticeJournal from './pages/ApprenticeJournal';
import InviteUserForm from './components/AddUser';
import JournalDeFormationForm from './components/CreateJournauxForm';
import UploadForm from './components/uploadForm';
import AuthPage from './pages/Authpage';
import UserDashboard from './pages/UserDashboard';
import TutorDashboard from './pages/TutorDashboard';
import CoordinatorDashboard  from './pages/CoordinatorDashboard';
import EntrepriseDashboard  from './pages/EntrepriseDashboard';
import AdminDashboard  from './pages/AdminDashboard';
import Apprenti from './pages/Apprenti';
import DocumentList from './pages/DocumentList';
import ProfilePage from './components/ProfilePage';
import EventForm from './components/EventForm';
import { logout } from './services/api';
import Notifications from './pages/notification';



const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userType, setUserType] = useState(localStorage.getItem('userType'));
  
  const handleLogout = () => {
    logout(); // Supprime les tokens du localStorage
    setToken(null); // Réinitialise l'état global
  };
  

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

  }, [token]);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    console.log('userType récupéré:', storedUserType); // Ajoute cette ligne pour voir si 'userType' est bien récupéré
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);
  

  return (
    <BrowserRouter>
      <Routes>

        
      <Route
          path="/"
          element={
            !token ? (
              <AuthPage setToken={setToken} />
            ) : (
              (() => {
                const userType = parseInt(localStorage.getItem('userType'), 10); // Récupère le type d'utilisateur
                switch (userType) { // Convertir en entier pour comparaison
                  case 1:
                    return <Navigate to="/AdminDashboard" replace />;
                  case 2:
                    return <Navigate to="/ApprentiDashboard" replace />;
                  case 3:
                    return <Navigate to="/TutorDashboard" replace />;
                  case 4:
                    return <Navigate to="/EnseignantDashboard" replace />;
                  case 5:
                    return <Navigate to="/MaitreDashboard" replace />;
                  case 6:
                    return <Navigate to="/CoordinatorDashboard" replace />;
                  case 7:
                    return <Navigate to="/EntrepriseDashboard" replace />;
                  default:
                    return <Navigate to="/dashboard" replace />; // Par défaut, retourne à l'accueil
                }
              })()
            )
          }
        />


        <Route
          path="/MaitreDashboard"
          element={token ? <ApprenticesList/> : <Navigate to="/" replace />}
        />
        <Route
          path="/journal/:id"
          element={token ? <ApprenticeJournal /> : <Navigate to="/" replace />}
        />
        <Route
          path="/invite-user"
          element={token ? <InviteUserForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/create-journal"
          element={token ? <JournalDeFormationForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/upload-document"
          element={token ? <UploadForm /> : <Navigate to="/" replace />}
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/TutorDashboard" element={<ApprenticesList />} />
        <Route path="/EntrepriseDashboard" element={<EntrepriseDashboard />} />
        <Route path="/CoordinatorDashboard" element={<CoordinatorDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/ApprentiDashboard" element={<Apprenti />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/journal-views" element={<DocumentList />} />
        <Route path="/profile-views" element={<ProfilePage />} />
        <Route path="/event-form" element={<EventForm />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route
          path="/dashboard"
          element={
            token ? (
              <CoordinatorDashboard onLogout={handleLogout} />) : (<Navigate to="/" replace />)
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
