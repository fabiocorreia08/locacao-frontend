import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { salvar } from '../../services/locacaoService';
import { buscarTodos as buscarImoveis } from '../../services/imovelService';
import { buscarTodos as buscarLocadores } from '../../services/locadorService';
import { buscarPorCpf as buscarLocatarioPorCpf } from '../../services/locatarioService';
import { converterInputParaISO } from '../../utils/dataUtils';
import { DateTime } from 'luxon';
import Cleave from 'cleave.js/react';
import { toast } from 'react-toastify';
import './LocacaoForm.css';

const LocacaoForm = () => {
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
      dataReserva: '',
      valorReserva: '',
      valorRestante: ''
    },
    locador: { cpf: '', nome: '' },
    locatario: { cpf: '', nome: '' }
  });

  const [imoveis, setImoveis] = useState([]);
  const [locadores, setLocadores] = useState([]);

  useEffect(() => {
    buscarImoveis()
      .then((res) => setImoveis(res.data))
      .catch(() => toast.error('Erro ao carregar imóveis.'));

    buscarLocadores()
      .then((res) => setLocadores(res.data))
      .catch(() => toast.error('Erro ao carregar locadores.'));
  }, []);

  const limparValorMonetario = (valor) => {
    if (!valor) return '';
    return valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
  };

  const handleLocacaoChange = (e) => {
    const { name, value } = e.target;
    const updatedLocacao = { ...formData.locacao, [name]: value };

    // Cálculo de qtdDias
    if (name === 'dataInicio' || name === 'dataFim') {
      const inicio = DateTime.fromISO(updatedLocacao.dataInicio);
      const fim = DateTime.fromISO(updatedLocacao.dataFim);
      if (inicio.isValid && fim.isValid && fim >= inicio) {
        const diffDays = fim.diff(inicio, 'days').days;
        updatedLocacao.qtdDias = Math.ceil(diffDays);
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
    } catch (error) {
      if (error.response?.status === 404) {
        toast.warn('Locatário não encontrado.');
        setFormData((prev) => ({
          ...prev,
          locatario: { ...prev.locatario, nome: '' },
          locacao: { ...prev.locacao, locatarioId: '' }
        }));
      } else {
        toast.error('Erro ao buscar locatário.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData.locacao,
      dataInicio: converterInputParaISO(formData.locacao.dataInicio),
      dataFim: converterInputParaISO(formData.locacao.dataFim),
      dataReserva: converterInputParaISO(formData.locacao.dataReserva),
      valorDiaria: parseFloat(limparValorMonetario(formData.locacao.valorDiaria)),
      valorLocacao: parseFloat(limparValorMonetario(formData.locacao.valorLocacao)),
      valorFaxina: parseFloat(limparValorMonetario(formData.locacao.valorFaxina)),
      valorTotal: parseFloat(limparValorMonetario(formData.locacao.valorTotal)),
      valorReserva: parseFloat(limparValorMonetario(formData.locacao.valorReserva)),
      valorRestante: parseFloat(limparValorMonetario(formData.locacao.valorRestante))
    };

    salvar(payload)
      .then(() => {
        toast.success('Locação cadastrada com sucesso!');
        navigate('/locacao');
      })
      .catch((error) => {
        const status = error.response?.status;
        const message = error.response?.data;

        if (status === 409) {
          toast.error(message || 'Este imóvel já está reservado nesse período.');
        } else if (status === 404) {
          toast.error(message || 'Algum dado não foi encontrado.');
        } else {
          toast.error('Erro ao salvar. Verifique os dados.');
        }
      });
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
        <h2>Cadastrar Locação</h2>
        <form className="form-locacao" onSubmit={handleSubmit}>
          <label>Imóvel:</label>
          <select value={formData.locacao.imovelId} onChange={handleImovelChange}>
            <option value="">Selecione</option>
            {imoveis.map((imovel) => (
              <option key={imovel.id} value={imovel.id}>{imovel.descricao}</option>
            ))}
          </select>

          <label>Locador:</label>
          <select value={formData.locador.cpf} onChange={handleLocadorChange}>
            <option value="">Selecione</option>
            {locadores.map((locador) => (
              <option key={locador.cpf} value={locador.cpf}>{locador.nome}</option>
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
            options={{ delimiters: ['.', '.', '-'], blocks: [3, 3, 3, 2], numericOnly: true }}
          />

        <label>Nome Locatário:</label>
        <input type="text" value={formData.locatario.nome} readOnly />

        <label>Data Início:</label>
        <input type="date" name="dataInicio" value={formData.locacao.dataInicio} onChange={handleLocacaoChange} />

        <label>Data Fim:</label>
        <input type="date" name="dataFim" value={formData.locacao.dataFim} onChange={handleLocacaoChange} />

        <label>Qtd Dias:</label>
        <input type="number" name="qtdDias" value={formData.locacao.qtdDias} readOnly />

        <label>Qtd Pessoas:</label>
        <input type="number" name="qtdPessoas" value={formData.locacao.qtdPessoas} onChange={handleLocacaoChange} />

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
            Salvar
          </button>
        </div>
      </form>
    </section>
    <Footer />
  </>
  );
};

export default LocacaoForm;