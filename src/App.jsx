import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionExpiredPopup from './components/SessionExpired/SessionExpiredPopup';

function App() {
  
  return (
    <div className="app-container">
      <AppRoutes />
      <ToastContainer />
      <SessionExpiredPopup />
    </div>
  );
}

export default App;