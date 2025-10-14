import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { buscarPorId, atualizar } from '../../services/locadorService';
import './LocadorForm.css';
import { toast } from 'react-toastify';
import Cleave from 'cleave.js/react';

const LocadorEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [cepErro, setCepErro] = useState('');

  useEffect(() => {
    buscarPorId(id)
      .then((res) => setFormData(res.data))
      .catch((err) => {
        console.error('Erro ao buscar locador:', err);
        toast.error('Locador não encontrado.');
        navigate('/locador');
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const upperValue = (name === 'email' || name === 'cep') ? value : value.toUpperCase();

    if (formData.endereco && name in formData.endereco) {
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
    atualizar(id, formData)
      .then(() => {
        toast.success('Locador atualizado com sucesso!');
        navigate('/locador');
      })
      .catch((err) => {
        console.error('Erro ao atualizar locador:', err);
        toast.error('Erro ao salvar alterações.');
      });
  };

  if (!formData) return null;

  return (
    <>
      <Navbar />
      <section className="form-container">
        <h2>Editar Locador</h2>
        <form className="form-locador" onSubmit={handleSubmit}>
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

          <label>CEP:</label>
          <Cleave
            name="cep"
            value={formData.endereco?.cep || ''}
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
          <input type="text" name="logradouro" value={formData.endereco?.logradouro || ''} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <label>Número:</label>
          <input type="text" name="numero" value={formData.endereco?.numero || ''} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <label>Complemento:</label>
          <input type="text" name="complemento" value={formData.endereco?.complemento || ''} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <label>Bairro:</label>
          <input type="text" name="bairro" value={formData.endereco?.bairro || ''} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <label>Cidade:</label>
          <input type="text" name="cidade" value={formData.endereco?.cidade || ''} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <label>Estado:</label>
          <input type="text" name="estado" value={formData.endereco?.estado || ''} onChange={handleChange} style={{ textTransform: 'uppercase' }} />

          <div className="form-acoes">
            <button type="button" className="cancelar" onClick={() => navigate('/locador')}>Cancelar</button>
            <button type="submit" className="salvar">Salvar</button>
          </div>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default LocadorEditar;