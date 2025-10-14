import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { salvar } from '../../services/imovelService';
import './ImovelForm.css';
import { toast } from 'react-toastify';
import Cleave from 'cleave.js/react';

const ImovelForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tipo: '',
    descricao: '',
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

    if (name in formData.endereco) {
      setFormData({
        ...formData,
        endereco: {
          ...formData.endereco,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
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
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }
        });
      })
      .catch(() => setCepErro('Erro ao buscar CEP.'));
  };

  const isEnderecoValido = () => {
    const { logradouro, bairro, cidade, estado } = formData.endereco;
    return logradouro && bairro && cidade && estado;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEnderecoValido()) {
      alert('Preencha corretamente os dados de endereço antes de salvar.');
      return;
    }

    salvar(formData)
      .then(() => {
        toast.success('Imóvel cadastrado com sucesso!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        navigate('/imovel');
      })
      .catch((err) => {
        console.error('Erro ao cadastrar imóvel:', err);
        alert('Erro ao salvar. Verifique os dados e tente novamente.');
      });
  };

  return (
    <>
      <Navbar />
      <section className="form-container">
        <h2>Cadastrar Imóvel</h2>
        <form className="form-imovel" onSubmit={handleSubmit}>
          <label>Tipo:</label>
          <select name="tipo" value={formData.tipo} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="Casa">Casa</option>
            <option value="Apartamento">Apartamento</option>
          </select>

          <label>Descrição:</label>
          <input
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
          />

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
          <input
            type="text"
            name="logradouro"
            value={formData.endereco.logradouro}
            onChange={handleChange}
          />

          <label>Número:</label>
          <input
            type="text"
            name="numero"
            value={formData.endereco.numero}
            onChange={handleChange}
          />

          <label>Complemento:</label>
          <input
            type="text"
            name="complemento"
            value={formData.endereco.complemento}
            onChange={handleChange}
          />

          <label>Bairro:</label>
          <input
            type="text"
            name="bairro"
            value={formData.endereco.bairro}
            onChange={handleChange}
          />

          <label>Cidade:</label>
          <input
            type="text"
            name="cidade"
            value={formData.endereco.cidade}
            onChange={handleChange}
          />

          <label>Estado:</label>
          <input
            type="text"
            name="estado"
            value={formData.endereco.estado}
            onChange={handleChange}
          />

          <div className="form-acoes">
            <button
              type="button"
              className="cancelar"
              onClick={() => navigate('/imovel')}
            >
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

export default ImovelForm;