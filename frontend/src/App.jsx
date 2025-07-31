import React, { useState } from 'react';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import { setToken } from './api.js';

export default function App(){
  const [token,setTok] = useState(localStorage.getItem('token'));
  if (token) setToken(token);

  return token
    ? <Dashboard onLogout={() => { localStorage.removeItem('token'); setTok(null); }} />
    : <Login onLogin={(tok) => { localStorage.setItem('token',tok); setTok(tok); }} />;
}
