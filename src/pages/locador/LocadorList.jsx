import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { buscarTodos, remover } from '../../services/locadorService';
import './LocadorList.css';
import { toast } from 'react-toastify';

const LocadorList = () => {
  const [locadores, setLocadores] = useState([]);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [locadorSelecionado, setLocadorSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarLocadores();
  }, []);

  const carregarLocadores = () => {
    buscarTodos()
      .then((res) => setLocadores(res.data))
      .catch((err) => {
        console.error('Erro ao carregar locadores:', err);
        toast.error('Erro ao buscar locadores.');
      });
  };

  const confirmarExclusao = (locador) => {
    setLocadorSelecionado(locador);
    setMostrarConfirmacao(true);
  };

  const excluirLocador = () => {
    remover(locadorSelecionado.id)
      .then(() => {
        setMostrarConfirmacao(false);
        carregarLocadores();
        toast.success('Locador excluído com sucesso!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      })
      .catch((err) => {
        console.error('Erro ao excluir locador:', err);
        toast.error('Erro ao excluir locador.');
        setMostrarConfirmacao(false);
      });
  };

  return (
    <>
      <Navbar />
      <main className="conteudo-principal">
        <section className="listagem-padrao">
          <div className="header">
            <h2>Locadores</h2>
            <button className="btn-novo" onClick={() => navigate('/locador/novo')}>+ Novo</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {locadores.map((locador) => (
                <tr key={locador.id}>
                  <td>{locador.nome}</td>
                  <td>{locador.cpf}</td>
                  <td>{locador.telefone}</td>
                  <td>{locador.email}</td>
                  <td>
                    <button className="btn-acao detalhar" onClick={() => navigate(`/locador/detalhar/${locador.id}`)}>🔍</button>
                    <button className="btn-acao editar" onClick={() => navigate(`/locador/editar/${locador.id}`)}>✏️</button>
                    <button className="btn-acao excluir" onClick={() => confirmarExclusao(locador)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {mostrarConfirmacao && (
            <div className="modal-overlay">
              <div className="modal">
                <p>Tem certeza que deseja excluir o locador <strong>{locadorSelecionado.nome}</strong>?</p>
                <div className="modal-actions">
                  <button onClick={() => setMostrarConfirmacao(false)} className="cancelar">Cancelar</button>
                  <button onClick={excluirLocador} className="salvar">Confirmar</button>
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

export default LocadorList;