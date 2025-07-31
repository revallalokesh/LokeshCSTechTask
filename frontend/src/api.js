import axios from 'axios';
const API = axios.create({ baseURL:'http://localhost:5000/api' });
export function setToken(token) {
  API.defaults.headers.common.Authorization = `Bearer ${token}`;
}
export default API;
