import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <p>© {new Date().getFullYear()} Casa da Andrea. Todos os direitos reservados.</p>
    <p>Contato: <a href="mailto:casadaandreasaquarema@gmail.com">casadaandreasaquarema@gmail.com</a></p>
  </footer>
);

export default Footer;