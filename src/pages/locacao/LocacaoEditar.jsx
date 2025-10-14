import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { buscarPorId, salvar } from '../../services/locacaoService';
import { buscarTodos as buscarImoveis } from '../../services/imovelService';
import { buscarTodos as buscarLocadores } from '../../services/locadorService';
import { buscarPorCpf as buscarLocatarioPorCpf, buscarPorId as buscarLocatarioPorId } from '../../services/locatarioService';
import './LocacaoForm.css';
import { toast } from 'react-toastify';
import Cleave from 'cleave.js/react';

const LocacaoEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    locacao: {
      imovelId: '',
      locadorId: '',
      locatarioId: '',
      dataInicio: '',
      dataFim: '',
      qtdDias: '',
      qtdPessoas: '',
      valorDiaria: '',
      valorLocacao: '',
      valorFaxina: '',
      valorTotal: '',
      valorReserva: '',
      dataReserva: '',
      valorRestante: ''
    },
    locador: { cpf: '', nome: '' },
    locatario: { cpf: '', nome: '' }
  });

  const [imoveis, setImoveis] = useState([]);
  const [locadores, setLocadores] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resImoveis, resLocadores, resLocacao] = await Promise.all([
          buscarImoveis(),
          buscarLocadores(),
          buscarPorId(id)
        ]);

        setImoveis(resImoveis.data);
        setLocadores(resLocadores.data);

        const dados = resLocacao.data;
        const locadorSelecionado = resLocadores.data.find((l) => l.id === dados.locadorId);
        const locatarioSelecionado = await buscarLocatarioPorId(dados.locatarioId).then((res) => res.data);

        setFormData({
          locacao: {
            ...dados,
            valorDiaria: dados.valorDiaria.toFixed(2).replace('.', ','),
            valorLocacao: dados.valorLocacao.toFixed(2).replace('.', ','),
            valorFaxina: dados.valorFaxina.toFixed(2).replace('.', ','),
            valorTotal: dados.valorTotal.toFixed(2).replace('.', ','),
            valorReserva: dados.valorReserva.toFixed(2).replace('.', ','),
            valorRestante: dados.valorRestante.toFixed(2).replace('.', ',')
          },
          locador: {
            cpf: locadorSelecionado?.cpf || '',
            nome: locadorSelecionado?.nome || ''
          },
          locatario: {
            cpf: locatarioSelecionado?.cpf || '',
            nome: locatarioSelecionado?.nome || ''
          }
        });
      } catch {
        toast.error('Erro ao carregar locação.');
        navigate('/locacao');
      }
    };

    carregarDados();
  }, [id, navigate]);

  const limparValorMonetario = (valor) => {
    if (!valor) return '';
    return valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
  };

  const handleLocacaoChange = (e) => {
    const { name, value } = e.target;
    const updatedLocacao = { ...formData.locacao, [name]: value };

    // Cálculo de qtdDias
    if (name === 'dataInicio' || name === 'dataFim') {
      const inicio = new Date(updatedLocacao.dataInicio);
      const fim = new Date(updatedLocacao.dataFim);
      if (!isNaN(inicio) && !isNaN(fim) && fim >= inicio) {
        const diffTime = Math.abs(fim - inicio);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        updatedLocacao.qtdDias = diffDays;
      } else {
        updatedLocacao.qtdDias = '';
      }
    }

    // Cálculo de valorLocacao
    const qtdPessoas = parseInt(updatedLocacao.qtdPessoas);
    const qtdDias = parseInt(updatedLocacao.qtdDias);
    const valorDiaria = parseFloat(limparValorMonetario(updatedLocacao.valorDiaria));

    if (!isNaN(qtdPessoas) && !isNaN(qtdDias) && !isNaN(valorDiaria)) {
      const valorLocacao = qtdPessoas * valorDiaria * qtdDias;
      updatedLocacao.valorLocacao = valorLocacao.toFixed(2).replace('.', ',');
    } else {
      updatedLocacao.valorLocacao = '';
    }

    // Cálculo de valorTotal
    const valorLocacaoNum = parseFloat(limparValorMonetario(updatedLocacao.valorLocacao));
    const valorFaxinaNum = parseFloat(limparValorMonetario(updatedLocacao.valorFaxina));
    if (!isNaN(valorLocacaoNum) && !isNaN(valorFaxinaNum)) {
      const total = valorLocacaoNum + valorFaxinaNum;
      updatedLocacao.valorTotal = total.toFixed(2).replace('.', ',');
    } else {
      updatedLocacao.valorTotal = '';
    }

    // Cálculo de valorRestante
    const valorReservaNum = parseFloat(limparValorMonetario(updatedLocacao.valorReserva));
    const valorTotalNum = parseFloat(limparValorMonetario(updatedLocacao.valorTotal));
    if (!isNaN(valorTotalNum) && !isNaN(valorReservaNum)) {
      const restante = valorTotalNum - valorReservaNum;
      updatedLocacao.valorRestante = restante.toFixed(2).replace('.', ',');
    } else {
      updatedLocacao.valorRestante = '';
    }

    setFormData((prev) => ({
      ...prev,
      locacao: updatedLocacao
    }));
  };

  const handleImovelChange = (e) => {
    const id = e.target.value;
    setFormData((prev) => ({
      ...prev,
      locacao: { ...prev.locacao, imovelId: id }
    }));
  };

  const handleLocadorChange = (e) => {
    const cpf = e.target.value;
    const locadorSelecionado = locadores.find((l) => l.cpf === cpf);
    setFormData((prev) => ({
      ...prev,
      locador: { cpf, nome: locadorSelecionado?.nome || '' },
      locacao: { ...prev.locacao, locadorId: locadorSelecionado?.id || '' }
    }));
  };

  const handleCpfLocatarioBlur = async () => {
    if (!formData.locatario.cpf) return;
    try {
      const res = await buscarLocatarioPorCpf(formData.locatario.cpf);
      const locatario = res.data;
      setFormData((prev) => ({
        ...prev,
        locatario: { cpf: formData.locatario.cpf, nome: locatario.nome },
        locacao: { ...prev.locacao, locatarioId: locatario.id }
      }));
    } catch {
      toast.error('Erro ao buscar locatário.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData.locacao,
      valorDiaria: parseFloat(limparValorMonetario(formData.locacao.valorDiaria)),
      valorLocacao: parseFloat(limparValorMonetario(formData.locacao.valorLocacao)),
      valorFaxina: parseFloat(limparValorMonetario(formData.locacao.valorFaxina)),
      valorTotal: parseFloat(limparValorMonetario(formData.locacao.valorTotal)),
      valorReserva: parseFloat(limparValorMonetario(formData.locacao.valorReserva)),
      valorRestante: parseFloat(limparValorMonetario(formData.locacao.valorRestante))
    };

    salvar(payload)
      .then(() => {
        toast.success('Locação atualizada com sucesso!');
        navigate('/locacao');
      })
      .catch(() => toast.error('Erro ao atualizar locação.'));
  };

  const cleaveOptions = {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    numeralDecimalMark: ',',
    delimiter: '.',
    prefix: 'R$ ',
    rawValueTrimPrefix: true
  };

  return (
    <>
      <Navbar />
      <section className="form-container">
        <h2>Editar Locação</h2>        
        <form className="form-locacao" onSubmit={handleSubmit}>
          <label>Imóvel:</label>
          <select value={formData.locacao.imovelId} onChange={handleImovelChange}>
            <option value="">Selecione</option>
            {imoveis.map((imovel) => (
              <option key={imovel.id} value={imovel.id}>
                {imovel.descricao}
              </option>
            ))}
          </select>

          <label>Locador:</label>
          <select value={formData.locador.cpf} onChange={handleLocadorChange}>
            <option value="">Selecione</option>
            {locadores.map((locador) => (
              <option key={locador.cpf} value={locador.cpf}>
                {locador.nome}
              </option>
            ))}
          </select>

          <label>CPF Locatário:</label>
          <Cleave
            value={formData.locatario.cpf}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                locatario: { ...prev.locatario, cpf: e.target.value }
              }))
            }
            onBlur={handleCpfLocatarioBlur}
            options={{
              delimiters: ['.', '.', '-'],
              blocks: [3, 3, 3, 2],
              numericOnly: true
            }}
          />

          <label>Nome Locatário:</label>
          <input type="text" value={formData.locatario.nome} readOnly />

          <label>Data Início:</label>
          <input
            type="date"
            name="dataInicio"
            value={formData.locacao.dataInicio}
            onChange={handleLocacaoChange}
          />

          <label>Data Fim:</label>
          <input
            type="date"
            name="dataFim"
            value={formData.locacao.dataFim}
            onChange={handleLocacaoChange}
          />

          <label>Qtd Dias:</label>
          <input
            type="number"
            name="qtdDias"
            value={formData.locacao.qtdDias}
            readOnly
          />

          <label>Qtd Pessoas:</label>
          <input
            type="number"
            name="qtdPessoas"
            value={formData.locacao.qtdPessoas}
            onChange={handleLocacaoChange}
          />

          <label>Valor Diária:</label>
          <Cleave
            name="valorDiaria"
            value={formData.locacao.valorDiaria}
            onChange={handleLocacaoChange}
            options={cleaveOptions}
          />

          <label>Valor Locação:</label>
          <Cleave
            name="valorLocacao"
            value={formData.locacao.valorLocacao}
            options={cleaveOptions}
            readOnly
          />

          <label>Valor Faxina:</label>
          <Cleave
            name="valorFaxina"
            value={formData.locacao.valorFaxina}
            onChange={handleLocacaoChange}
            options={cleaveOptions}
          />

          <label>Valor Total:</label>
          <input
            type="text"
            name="valorTotal"
            value={`R$ ${formData.locacao.valorTotal}`}
            readOnly
          />

          <label>Data Reserva:</label>
          <input
            type="date"
            name="dataReserva"
            value={formData.locacao.dataReserva}
            onChange={handleLocacaoChange}
          />

          <label>Valor Reserva:</label>
          <Cleave
            name="valorReserva"
            value={formData.locacao.valorReserva}
            onChange={handleLocacaoChange}
            options={cleaveOptions}
          />

          <label>Valor Restante:</label>
          <input
            type="text"
            name="valorRestante"
            value={`R$ ${formData.locacao.valorRestante}`}
            readOnly
          />

          <div className="form-acoes">
            <button type="button" className="cancelar" onClick={() => navigate('/locacao')}>
              Cancelar
            </button>
            <button type="submit" className="salvar">
              Atualizar
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default LocacaoEditar;