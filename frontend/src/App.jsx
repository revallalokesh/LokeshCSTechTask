import React, { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import { setToken, testAPI, testLogin } from './api.js';

// Global test functions for debugging
window.testAPI = testAPI;
window.testLogin = testLogin;

export default function App() {
  const [token, setTok] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      console.log('Setting token on app load');
      setToken(token);
    } else {
      console.log('No token found, clearing auth headers');
      setToken(null);
    }
    setIsLoading(false);
  }, [token]);

  const handleLogin = (newToken) => {
    console.log('Login successful, setting token');
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setTok(newToken);
  };

  const handleLogout = () => {
    console.log('Logging out, clearing token');
    localStorage.removeItem('token');
    setToken(null);
    setTok(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return token
    ? <Dashboard onLogout={handleLogout} />
    : <Login onLogin={handleLogin} />;
}
