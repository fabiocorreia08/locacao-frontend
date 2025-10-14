// src/services/api.js
import axios from "axios";

// Cria instância Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Interceptor de requisição: adiciona token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta: logout automático se token expirar ou for inválido
api.interceptors.response.use(
  (response) => response, // passa resposta normal
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // remove token
      localStorage.removeItem("token");
      // redireciona para login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;