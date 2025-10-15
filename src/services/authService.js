import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/auth`;

export const login = (credentials) => {
  console.log(API_URL);
  return axios.post(`${API_URL}/login`, credentials);
};