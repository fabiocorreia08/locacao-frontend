import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { buscarPorId } from '../../services/imovelService';
import './ImovelDetalhar.css';

const ImovelDetalhar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imovel, setImovel] = useState(null);

  useEffect(() => {
    buscarPorId(id)
      .then((res) => setImovel(res.data))
      .catch((err) => {
        console.error('Erro ao buscar imóvel:', err);
        alert('Imóvel não encontrado.');
        navigate('/imovel');
      });
  }, [id, navigate]);

  const formatarCep = (cep) => {
    const apenasNumeros = cep?.replace(/\D/g, '');
    if (apenasNumeros?.length === 8) {
      return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5)}`;
    }
    return cep;
  };

  if (!imovel) return null;

  return (
    <>
      <Navbar />
      <section className="detalhar-container">
        <h2>Detalhar Imóvel</h2>
        <div className="detalhes">
          <p><strong>Tipo:</strong> {imovel.tipo}</p>
          <p><strong>Descrição:</strong> {imovel.descricao}</p>

          {imovel.endereco && (
            <>
              <p><strong>Logradouro:</strong> {imovel.endereco.logradouro}</p>
              <p><strong>Número:</strong> {imovel.endereco.numero}</p>
              <p><strong>Complemento:</strong> {imovel.endereco.complemento}</p>
              <p><strong>Bairro:</strong> {imovel.endereco.bairro}</p>
              <p><strong>Cidade:</strong> {imovel.endereco.cidade}</p>
              <p><strong>Estado:</strong> {imovel.endereco.estado}</p>
              <p><strong>CEP:</strong> {formatarCep(imovel.endereco.cep)}</p>
            </>
          )}
        </div>
        <div className="voltar">
          <button onClick={() => navigate('/imovel')}>Voltar</button>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ImovelDetalhar;