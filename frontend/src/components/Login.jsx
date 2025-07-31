import React, {useState} from 'react';
import API from '../api.js';
export default function Login({ onLogin }){
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState('');
  const handle = async e=>{
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login',{ email, password });
      onLogin(data.token);
    } catch {
      setError('Invalid credentials');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handle} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4 text-center">Admin Login</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input type="email" placeholder="Email" className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="input" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit" className="btn w-full">Log In</button>
      </form>
    </div>
  );
}
