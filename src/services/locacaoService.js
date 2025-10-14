// src/services/locacaoService.js
import api from './api';

const API_URL = '/api/locacoes';

export const buscarTodos = () => api.get(API_URL);
export const buscarPorId = (id) => api.get(`${API_URL}/${id}`);
export const salvar = (dados) => api.post(API_URL, dados);
export const atualizar = (id, dados) => api.put(`${API_URL}/${id}`, dados);
export const remover = (id) => api.delete(`${API_URL}/${id}`);

export const buscarPaginado = (nomeLocatario, dataInicio, page, size) =>
  api.get(`${API_URL}/filtrar`, {
    params: {
      nomeLocatario,
      dataInicio,
      page,
      size,
      sort: 'dataInicio,desc',
    },
  });

export const buscarIntervalosPorAno = (ano) =>
  api.get(`${API_URL}/intervalos`, {
    params: { ano }
  });
