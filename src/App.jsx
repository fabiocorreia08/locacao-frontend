import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionExpiredPopup from './components/SessionExpired/SessionExpiredPopup';

function App() {
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('session-expired'));
    }, 3000); // dispara após 3 segundos
  }, []);

  return (
    <div className="app-container">
      <AppRoutes />
      <ToastContainer />
      <SessionExpiredPopup />
    </div>
  );
}

export default App;