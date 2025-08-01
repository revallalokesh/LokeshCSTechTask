import React, { useState } from 'react';
import API from '../api.js';

export default function UploadList({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async e => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'axls'].includes(ext)) {
      setError('Invalid file type. Please upload CSV, XLSX, or AXLS files only.');
      return;
    }
    
    setError('');
    setSuccess('Uploading...');
    setLoading(true);
    
    const form = new FormData(); 
    form.append('file', file);
    
    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    try { 
      const response = await API.post('/agents/upload-list', form);
      console.log('Upload response:', response);
      onUploaded(); 
      setSuccess('Tasks uploaded and distributed successfully!');
      setFile(null);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Upload failed. Please check your file format.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handle} className="bg-white rounded p-4 shadow sm:mb-4">
      <h3 className="text-xl mb-3">Upload Task List</h3>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <input 
        type="file" 
        accept=".csv,.xlsx,.axls" 
        onChange={e => setFile(e.target.files[0])} 
        required 
        disabled={loading}
      />
      <button 
        type="submit" 
        className="btn mt-2" 
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}
