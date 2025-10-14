import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { buscarPaginado, remover } from '../../services/locatarioService';
import './LocatarioList.css';
import { toast } from 'react-toastify';

const LocatarioList = () => {
  const [locatarios, setLocatarios] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [filtroNome, setFiltroNome] = useState('');
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [locatarioSelecionado, setLocatarioSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    buscarPaginado(filtroNome, pagina, 5)
      .then((res) => {
        setLocatarios(res.data.content);
        setTotalPaginas(res.data.totalPages);
      })
      .catch((err) => {
        console.error('Erro ao buscar locatários:', err);
        toast.error('Erro ao buscar locatários.');
      });
  }, [pagina, filtroNome]);

  const confirmarExclusao = (locatario) => {
    setLocatarioSelecionado(locatario);
    setMostrarConfirmacao(true);
  };

  const excluirLocatario = () => {
    remover(locatarioSelecionado.id)
      .then(() => {
        toast.success('Locatário excluído com sucesso!');
        setMostrarConfirmacao(false);
        buscarPaginado(filtroNome, pagina, 5)
          .then((res) => {
            setLocatarios(res.data.content);
            setTotalPaginas(res.data.totalPages);
          });
      })
      .catch((err) => {
        console.error('Erro ao excluir locatário:', err);
        toast.error('Erro ao excluir locatário.');
        setMostrarConfirmacao(false);
      });
  };

  return (
    <>
      <Navbar />
      <main className="conteudo-principal">
        <section className="listagem-padrao">
          <div className="header">
            <h2>Locatários</h2>
            <button className="btn-novo" onClick={() => navigate('/locatario/novo')}>+ Novo</button>
          </div>

          <input
            type="text"
            placeholder="Filtrar por nome"
            value={filtroNome}
            onChange={(e) => {
              setPagina(0); // Reinicia na primeira página ao filtrar
              setFiltroNome(e.target.value);
            }}
          />

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
              {locatarios.map((locatario) => (
                <tr key={locatario.id}>
                  <td>{locatario.nome}</td>
                  <td>{locatario.cpf}</td>
                  <td>{locatario.telefone}</td>
                  <td>{locatario.email}</td>
                  <td>
                    <button className="btn-acao detalhar" onClick={() => navigate(`/locatario/detalhar/${locatario.id}`)}>🔍</button>
                    <button className="btn-acao editar" onClick={() => navigate(`/locatario/editar/${locatario.id}`)}>✏️</button>
                    <button className="btn-acao excluir" onClick={() => confirmarExclusao(locatario)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="paginacao">
            <button disabled={pagina === 0} onClick={() => setPagina(pagina - 1)}>Anterior</button>
            <span>Página {pagina + 1} de {totalPaginas}</span>
            <button disabled={pagina + 1 === totalPaginas} onClick={() => setPagina(pagina + 1)}>Próxima</button>
          </div>

          {mostrarConfirmacao && (
            <div className="modal-overlay">
              <div className="modal">
                <p>Tem certeza que deseja excluir o locatário <strong>{locatarioSelecionado.nome}</strong>?</p>
                <div className="modal-actions">
                  <button onClick={() => setMostrarConfirmacao(false)} className="cancelar">Cancelar</button>
                  <button onClick={excluirLocatario} className="salvar">Confirmar</button>
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

export default LocatarioList;