import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { buscarPorId } from '../../services/locacaoService';
import { buscarTodos as buscarImoveis } from '../../services/imovelService';
import { buscarTodos as buscarLocadores } from '../../services/locadorService';
import { buscarPorId as buscarLocatarioPorId } from '../../services/locatarioService';
import './LocacaoForm.css';

const LocacaoDetalhar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [locacao, setLocacao] = useState(null);
  const [imovel, setImovel] = useState({});
  const [locador, setLocador] = useState({});
  const [locatario, setLocatario] = useState({});

  useEffect(() => {
    buscarPorId(id)
      .then((res) => {
        const dados = res.data;
        setLocacao(dados);

        buscarImoveis().then((res) => {
          const encontrado = res.data.find((i) => i.id === dados.imovelId);
          setImovel(encontrado || {});
        });

        buscarLocadores().then((res) => {
          const encontrado = res.data.find((l) => l.id === dados.locadorId);
          setLocador(encontrado || {});
        });

        buscarLocatarioPorId(dados.locatarioId).then((res) => {
          setLocatario(res.data || {});
        });
      })
      .catch(() => {
        alert('Erro ao carregar locação');
        navigate('/locacao');
      });
  }, [id, navigate]);

  const formatarValor = (valor) => {
    const num = parseFloat(valor);
    return !isNaN(num) ? `R$ ${num.toFixed(2).replace('.', ',')}` : '';
  };

  if (!locacao) return null;

  return (
    <>
      <Navbar />
      <section className="form-container">
        <h2>Detalhes da Locação</h2>
        <form className="form-locacao">
          <label>Imóvel:</label>
          <input type="text" value={imovel.descricao || ''} disabled />

          <label>Locador:</label>
          <input type="text" value={locador.nome || ''} disabled />

          <label>CPF Locatário:</label>
          <input type="text" value={locatario.cpf || ''} disabled />

          <label>Nome Locatário:</label>
          <input type="text" value={locatario.nome || ''} disabled />

          <label>Data Início:</label>
          <input type="date" value={locacao.dataInicio} disabled />

          <label>Data Fim:</label>
          <input type="date" value={locacao.dataFim} disabled />

          <label>Qtd Dias:</label>
          <input type="number" value={locacao.qtdDias} disabled />

          <label>Qtd Pessoas:</label>
          <input type="number" value={locacao.qtdPessoas} disabled />

          <label>Valor Locação:</label>
          <input type="text" value={formatarValor(locacao.valorLocacao)} disabled />

          <label>Valor Faxina:</label>
          <input type="text" value={formatarValor(locacao.valorFaxina)} disabled />

          <label>Valor Total:</label>
          <input type="text" value={formatarValor(locacao.valorTotal)} disabled />

          <label>Data Reserva:</label>
          <input type="date" value={locacao.dataReserva} disabled />

          <label>Valor Reserva:</label>
          <input type="text" value={formatarValor(locacao.valorReserva)} disabled />

          <label>Valor Restante:</label>
          <input type="text" value={formatarValor(locacao.valorRestante)} disabled />

          <div className="form-acoes">
            <button type="button" className="cancelar" onClick={() => navigate('/locacao')}>
              Voltar
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default LocacaoDetalhar;