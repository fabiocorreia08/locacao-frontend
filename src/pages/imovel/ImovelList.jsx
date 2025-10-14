import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { buscarTodos, remover } from '../../services/imovelService';
import './ImovelList.css';
import { toast } from 'react-toastify';

const ImovelList = () => {
  const [imoveis, setImoveis] = useState([]);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [imovelSelecionado, setImovelSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarImoveis();
  }, []);

  const carregarImoveis = () => {
    buscarTodos()
      .then((res) => setImoveis(res.data))
      .catch((err) => {
        console.error('Erro ao carregar imóveis:', err);
        toast.error('Erro ao buscar imóveis.');
      });
  };

  const confirmarExclusao = (imovel) => {
    setImovelSelecionado(imovel);
    setMostrarConfirmacao(true);
  };

  const excluirImovel = () => {
  remover(imovelSelecionado.id)
    .then(() => {
      toast.success('Imóvel excluído com sucesso!');
      setMostrarConfirmacao(false);
      carregarImoveis();
    })
    .catch((err) => {
      console.error('Erro ao excluir imóvel:', err);
      toast.error('Erro ao excluir imóvel.');
      setMostrarConfirmacao(false);
    });
  };

  return (
    <>
      <Navbar />
      <main className="conteudo-principal">
        <section className="listagem-padrao">
          <div className="header">
            <h2>Imóveis</h2>
            <button className="btn-novo" onClick={() => navigate('/imovel/novo')}>+ Novo</button>
          </div>
          <table>
            <thead>
              <tr>                
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Endereço</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {imoveis.map((imovel) => (
                <tr key={imovel.id}>                  
                  <td>{imovel.tipo}</td>
                  <td>{imovel.descricao}</td>
                  <td>
                    {imovel.endereco
                      ? `${imovel.endereco.logradouro}, ${imovel.endereco.numero} - ${imovel.endereco.bairro}, ${imovel.endereco.cidade} - ${imovel.endereco.estado}`
                      : 'Endereço não informado'}
                  </td>
                  <td>
                    <button className="btn-acao detalhar" onClick={() => navigate(`/imovel/detalhar/${imovel.id}`)}>🔍</button>
                    <button className="btn-acao editar" onClick={() => navigate(`/imovel/editar/${imovel.id}`)}>✏️</button>
                    <button className="btn-acao excluir" onClick={() => confirmarExclusao(imovel)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {mostrarConfirmacao && (
            <div className="modal-overlay">
              <div className="modal">
                <p>Tem certeza que deseja excluir o imóvel <strong>{imovelSelecionado.tipo}</strong>?</p>
                <div className="modal-actions">
                  <button onClick={() => setMostrarConfirmacao(false)} className="cancelar">Cancelar</button>
                  <button onClick={excluirImovel} className="salvar">Confirmar</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ImovelList;