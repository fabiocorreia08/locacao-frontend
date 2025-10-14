import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { buscarPorId } from '../../services/locadorService';
import './LocadorDetalhar.css';

const LocadorDetalhar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [locador, setLocador] = useState(null);

  useEffect(() => {
    buscarPorId(id)
      .then((res) => setLocador(res.data))
      .catch((err) => {
        console.error('Erro ao buscar locador:', err);
        alert('Locador não encontrado.');
        navigate('/locador');
      });
  }, [id, navigate]);

  if (!locador) return null;

  return (
    <>
      <Navbar />
      <section className="detalhar-container">
        <h2>Detalhar Locador</h2>
        <div className="detalhes">
          <p><strong>Nome:</strong> {locador.nome}</p>
          <p><strong>CPF:</strong> {locador.cpf}</p>
          <p><strong>Telefone:</strong> {locador.telefone}</p>
          <p><strong>Email:</strong> {locador.email}</p>

          {locador.endereco && (
            <>
              <p><strong>Logradouro:</strong> {locador.endereco.logradouro}</p>
              <p><strong>Número:</strong> {locador.endereco.numero}</p>
              <p><strong>Complemento:</strong> {locador.endereco.complemento}</p>
              <p><strong>Bairro:</strong> {locador.endereco.bairro}</p>
              <p><strong>Cidade:</strong> {locador.endereco.cidade}</p>
              <p><strong>Estado:</strong> {locador.endereco.estado}</p>
              <p><strong>CEP:</strong> {locador.endereco.cep}</p>
            </>
          )}
        </div>
        <div className="voltar">
          <button onClick={() => navigate('/locador')}>Voltar</button>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LocadorDetalhar;