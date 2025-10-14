import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { buscarPaginado, remover } from '../../services/locacaoService';
import './LocacaoList.css';
import { toast } from 'react-toastify';
import { formatarDataBR } from '../../utils/dataUtils'; // ✅ novo utilitário

const LocacaoList = () => {
  const [locacoes, setLocacoes] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [filtroLocatario, setFiltroLocatario] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [locacaoSelecionada, setLocacaoSelecionada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    buscarPaginado(filtroLocatario, filtroDataInicio, pagina, 5)
      .then((res) => {
        setLocacoes(res.data.content);
        setTotalPaginas(res.data.totalPages);
      })
      .catch((err) => {
        console.error('Erro ao buscar locações:', err);
        toast.error('Erro ao buscar locações.');
      });
  }, [pagina, filtroLocatario, filtroDataInicio]);

  const confirmarExclusao = (locacao) => {
    setLocacaoSelecionada(locacao);
    setMostrarConfirmacao(true);
  };

  const excluirLocacao = () => {
    remover(locacaoSelecionada.id)
      .then(() => {
        toast.success('Locação excluída com sucesso!');
        setMostrarConfirmacao(false);
        buscarPaginado(filtroLocatario, filtroDataInicio, pagina, 5)
          .then((res) => {
            setLocacoes(res.data.content);
            setTotalPaginas(res.data.totalPages);
          });
      })
      .catch((err) => {
        console.error('Erro ao excluir locação:', err);
        toast.error('Erro ao excluir locação.');
        setMostrarConfirmacao(false);
      });
  };

  return (
    <>
      <Navbar />
      <main className="conteudo-principal">
        <section className="listagem-padrao">
          <div className="header">
            <h2>Locações</h2>
            <button className="btn-novo" onClick={() => navigate('/locacao/novo')}>+ Novo</button>
          </div>

          <div className="filtros">
            <input
              type="text"
              placeholder="Filtrar por nome do locatário"
              value={filtroLocatario}
              onChange={(e) => {
                setPagina(0);
                setFiltroLocatario(e.target.value);
              }}
            />
            <input
              type="date"
              placeholder="Filtrar por data de início"
              value={filtroDataInicio}
              onChange={(e) => {
                setPagina(0);
                setFiltroDataInicio(e.target.value);
              }}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Nome Locatário</th>
                <th>Telefone Locatário</th>
                <th>Data Início</th>
                <th>Data Fim</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {locacoes.map((locacao) => (
                <tr key={locacao.id}>
                  <td>{locacao.locatarioDTO?.nome || 'Não informado'}</td>
                  <td>{locacao.locatarioDTO?.telefone || 'Não informado'}</td>
                  <td>{formatarDataBR(locacao.dataInicio)}</td>
                  <td>{formatarDataBR(locacao.dataFim)}</td>
                  <td>
                    <button className="btn-acao detalhar" onClick={() => navigate(`/locacao/detalhar/${locacao.id}`)}>🔍</button>
                    <button className="btn-acao editar" onClick={() => navigate(`/locacao/editar/${locacao.id}`)}>✏️</button>
                    <button className="btn-acao excluir" onClick={() => confirmarExclusao(locacao)}>🗑️</button>
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
                <p>
                  Tem certeza que deseja excluir a locação de{' '}
                  <strong>{locacaoSelecionada?.locatario?.nome || 'Locatário desconhecido'}</strong>?
                </p>
                <div className="modal-actions">
                  <button onClick={() => setMostrarConfirmacao(false)} className="cancelar">Cancelar</button>
                  <button onClick={excluirLocacao} className="salvar">Confirmar</button>
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

export default LocacaoList;