import axios from 'axios';

// Force the use of deployed backend URL
const getBaseURL = () => {
  // Always use deployed backend for now
  return 'https://lokeshcstechtask.onrender.com/api';
};

const API = axios.create({ 
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

console.log('Environment Info:', {
  hostname: window.location.hostname,
  href: window.location.href,
  baseURL: getBaseURL()
});

// Add request interceptor to log requests and handle FormData
API.interceptors.request.use(
  (config) => {
    // Force the correct baseURL
    config.baseURL = 'https://lokeshcstechtask.onrender.com/api';
    
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    console.log('Full URL:', config.baseURL + config.url);
    
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
    console.error('Error URL:', error.config?.url);
    console.error('Error Base URL:', error.config?.baseURL);
    console.error('Full Error:', error);
    
    // Provide more specific error messages
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - Backend might be down or CORS issue');
    } else if (error.response?.status === 400) {
      console.error('Bad Request - Check request data');
    } else if (error.response?.status === 401) {
      console.error('Unauthorized - Check authentication');
    } else if (error.response?.status === 500) {
      console.error('Server Error - Backend issue');
    }
    
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

// Test function to verify API connectivity
export async function testAPI() {
  try {
    console.log('Testing API connectivity...');
    const response = await API.get('/test');
    console.log('API Test Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Test Error:', error);
    throw error;
  }
}

// Test login function
export async function testLogin(email = 'admin@example.com', password = 'admin123') {
  try {
    console.log('Testing login...');
    const response = await API.post('/auth/login', { email, password });
    console.log('Login Test Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login Test Error:', error);
    throw error;
  }
}

export default API;
