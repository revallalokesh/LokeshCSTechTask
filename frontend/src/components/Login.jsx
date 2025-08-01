import React, {useState} from 'react';
import API from '../api.js';

export default function Login({ onLogin }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Attempting login with:', { email, password: '***' });
      const { data } = await API.post('/auth/login', { email, password });
      console.log('Login successful');
      onLogin(data.token);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handle} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4 text-center">Admin Login</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input 
          type="email" 
          placeholder="Email" 
          className="input" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          disabled={loading}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="input" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          disabled={loading}
        />
        <button 
          type="submit" 
          className="btn w-full" 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
