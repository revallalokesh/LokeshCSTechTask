import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://lokeshcstechtask.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export function setToken(token) {
  API.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export default API;
