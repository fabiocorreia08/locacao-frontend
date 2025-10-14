import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SessionExpiredPopup.css';

const SessionExpiredPopup = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => setVisible(true);
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, []);

  const handleConfirm = () => {
    localStorage.removeItem('token'); // ou sessionStorage
    setVisible(false);
    navigate('/login');
  };

  if (!visible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Sessão expirada</h2>
        <p>Você foi desconectado por inatividade.</p>
        <button onClick={handleConfirm}>OK</button>
      </div>
    </div>
  );
};

export default SessionExpiredPopup;