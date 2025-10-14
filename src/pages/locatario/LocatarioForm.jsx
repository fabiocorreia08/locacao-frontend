import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { salvar } from '../../services/locatarioService';
import './LocatarioForm.css';
import { toast } from 'react-toastify';
import Cleave from 'cleave.js/react';

const LocatarioForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    dataCadastro: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  });

  const [cepErro, setCepErro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const upperValue = (name === 'email' || name === 'cep') ? value : value.toUpperCase();

    if (name in formData.endereco) {
      setFormData({
        ...formData,
        endereco: {
          ...formData.endereco,
          [name]: upperValue
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: upperValue
      });
    }
  };

  const handleCepBlur = () => {
    const cep = formData.endereco.cep.replace(/\D/g, '');
    if (cep.length !== 8) {
      setCepErro('CEP deve conter 8 dígitos.');
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.erro) {
          setCepErro('CEP não encontrado.');
          return;
        }
        setCepErro('');
        setFormData({
          ...formData,
          endereco: {
            ...formData.endereco,
            logradouro: data.logradouro.toUpperCase(),
            bairro: data.bairro.toUpperCase(),
            cidade: data.localidade.toUpperCase(),
            estado: data.uf.toUpperCase()
          }
        });
      })
      .catch(() => setCepErro('Erro ao buscar CEP.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    salvar(formData)
      .then(() => {
        toast.success('Locatário cadastrado com sucesso!');
        navigate('/locatario');
      })
      .catch((err) => {
        console.error('Erro ao cadastrar locatário:', err);
        toast.error('Erro ao salvar. Verifique os dados.');
      });
  };

  return (
    <>
      <Navbar />
      <section className="form-container">
        <h2>Cadastrar Locatário</h2>
        <form className="form-locatario" onSubmit={handleSubmit}>
          <label>Nome:</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <label>CPF:</label>
          <Cleave
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            options={{
              delimiters: ['.', '.', '-'],
              blocks: [3, 3, 3, 2],
              numericOnly: true
            }}
          />

          <label>Telefone:</label>
          <Cleave
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            options={{
              delimiters: ['(', ') ', '-'],
              blocks: [0, 2, 5, 4],
              numericOnly: true
            }}
          />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label>Data de Cadastro:</label>
          <input type="date" name="dataCadastro" value={formData.dataCadastro} onChange={handleChange} />

          <label>CEP:</label>
          <Cleave
            name="cep"
            value={formData.endereco.cep}
            onChange={handleChange}
            onBlur={handleCepBlur}
            options={{
              delimiters: ['-'],
              blocks: [5, 3],
              numericOnly: true
            }}
          />
          {cepErro && <p className="erro-cep">{cepErro}</p>}

          <label>Logradouro:</label>
          <input type="text" name="logradouro" value={formData.endereco.logradouro} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <label>Número:</label>
          <input type="text" name="numero" value={formData.endereco.numero} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <label>Complemento:</label>
          <input type="text" name="complemento" value={formData.endereco.complemento} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <label>Bairro:</label>
          <input type="text" name="bairro" value={formData.endereco.bairro} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <label>Cidade:</label>
          <input type="text" name="cidade" value={formData.endereco.cidade} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <label>Estado:</label>
          <input type="text" name="estado" value={formData.endereco.estado} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <div className="form-acoes">
            <button type="button" className="cancelar" onClick={() => navigate('/locatario')}>Cancelar</button>
            <button type="submit" className="salvar">Salvar</button>
          </div>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default LocatarioForm;