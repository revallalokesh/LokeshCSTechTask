import React,{useState} from 'react';
import API from '../api.js';
export default function UploadList({ onUploaded }){
  const [file,setFile]=useState(null),[error,setError]=useState(''),[success,setSuccess]=useState('');
  const handle = async e=>{
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv','xlsx','axls'].includes(ext)) {
      setError('Invalid file type. Please upload CSV, XLSX, or AXLS files only.');
      return;
    }
    setError('');
    setSuccess('Uploading...');
    const form = new FormData(); 
    form.append('file',file);
    try { 
      await API.post('/agents/upload-list',form); 
      onUploaded(); 
      setSuccess('Tasks uploaded and distributed successfully!');
      setFile(null);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    }
    catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please check your file format.');
      setSuccess('');
    }
  };
  return (
    <form onSubmit={handle} className="bg-white rounded p-4 shadow sm:mb-4">
      <h3 className="text-xl mb-3">Upload Task List</h3>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <input type="file" accept=".csv,.xlsx,.axls" onChange={e=>setFile(e.target.files[0])} required />
      <button type="submit" className="btn mt-2">Upload</button>
    </form>
  );
}
