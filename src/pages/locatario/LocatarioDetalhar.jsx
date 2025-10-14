import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { buscarPorId } from '../../services/locatarioService';
import './LocatarioDetalhar.css';

const LocatarioDetalhar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [locatario, setLocatario] = useState(null);

  useEffect(() => {
    buscarPorId(id)
      .then((res) => setLocatario(res.data))
      .catch((err) => {
        console.error('Erro ao buscar locatário:', err);
        alert('Locatário não encontrado.');
        navigate('/locatario');
      });
  }, [id, navigate]);

  const formatarData = (data) => {
    if (!data) return '—';
    const dateObj = new Date(data);
    if (isNaN(dateObj)) return '—';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  };

  if (!locatario) return null;

  return (
    <>
      <Navbar />
      <section className="detalhar-container">
        <h2>Detalhar Locatário</h2>
        <div className="detalhes">
          <p><strong>Nome:</strong> {locatario.nome}</p>
          <p><strong>CPF:</strong> {locatario.cpf}</p>
          <p><strong>Telefone:</strong> {locatario.telefone}</p>
          <p><strong>Email:</strong> {locatario.email}</p>
          <p><strong>Data de Cadastro:</strong> {formatarData(locatario.dataCadastro)}</p>

          {locatario.endereco && (
            <>
              <p><strong>Logradouro:</strong> {locatario.endereco.logradouro}</p>
              <p><strong>Número:</strong> {locatario.endereco.numero}</p>
              <p><strong>Complemento:</strong> {locatario.endereco.complemento}</p>
              <p><strong>Bairro:</strong> {locatario.endereco.bairro}</p>
              <p><strong>Cidade:</strong> {locatario.endereco.cidade}</p>
              <p><strong>Estado:</strong> {locatario.endereco.estado}</p>
              <p><strong>CEP:</strong> {locatario.endereco.cep}</p>
            </>
          )}
        </div>
        <div className="voltar">
          <button onClick={() => navigate('/locatario')}>Voltar</button>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LocatarioDetalhar;