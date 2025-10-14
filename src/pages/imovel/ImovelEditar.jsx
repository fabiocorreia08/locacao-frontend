import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { buscarPorId, atualizar } from '../../services/imovelService';
import './ImovelEditar.css';
import { toast } from 'react-toastify';
import Cleave from 'cleave.js/react';

const ImovelEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    buscarPorId(id)
      .then((res) => setFormData(res.data))
      .catch((err) => {
        console.error('Erro ao buscar imóvel:', err);
        alert('Imóvel não encontrado.');
        navigate('/imovel');
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (formData.endereco && name in formData.endereco) {
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
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (data.erro) {
            alert('CEP não encontrado.');
            return;
          }
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
        .catch(() => alert('Erro ao buscar CEP.'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    atualizar(id, formData)
      .then(() => {
        toast.success('Imóvel atualizado com sucesso!', {
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
        console.error('Erro ao atualizar imóvel:', err);
        alert('Erro ao salvar alterações.');
      });
  };

  if (!formData) return null;

  return (
    <>
      <Navbar />
      <section className="editar-container">
        <h2>Editar Imóvel</h2>
        <form className="form-editar" onSubmit={handleSubmit}>
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

          {formData.endereco && (
            <>
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
            </>
          )}

          <div className="editar-acoes">
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

export default ImovelEditar;