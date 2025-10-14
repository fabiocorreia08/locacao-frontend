import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // 🔒 remove o token JWT
    navigate('/login'); // 🔄 redireciona para login
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">🏡 Casa da Andrea</div>

      <nav className="navbar-menu">
        <Link to="/">Home</Link>
        <Link to="/imovel">Imóvel</Link>
        <Link to="/locador">Locador</Link>
        <Link to="/locatario">Locatário</Link>
        <Link to="/locacao">Locação</Link>

        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
