import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import CalendarioAnual from '../../components/CalendarioAnual/CalendarioAnual';
import './Home.css';

const Home = () => {
  const anoAtual = new Date().getFullYear();

  const locacoes = [
    { dataInicio: '01/09/2025', dataFinal: '10/09/2025' },
    { dataInicio: '15/10/2025', dataFinal: '20/10/2025' }
  ];

  return (
    <>
      <Navbar />
      <main>
        <section className="welcome-banner">
          <h1>
            Bem-vindo ao sistema de locação de imóvel <strong>Casa da Andrea</strong>
          </h1>
        </section>

        <section className="calendario-container">
          <CalendarioAnual ano={anoAtual} locacoes={locacoes} />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;