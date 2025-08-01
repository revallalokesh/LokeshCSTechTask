import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to log requests and handle FormData
API.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    
    // If data is FormData, remove Content-Type to let browser set it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('FormData detected, removed Content-Type header');
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log responses
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export function setToken(token) {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log('Token set successfully');
  } else {
    delete API.defaults.headers.common.Authorization;
    console.log('Token removed');
  }
}

export default API;
