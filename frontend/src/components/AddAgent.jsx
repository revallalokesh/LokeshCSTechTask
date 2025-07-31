import React,{useState, useEffect} from 'react';
import API from '../api.js';
export default function AddAgent({ onAdded, editingAgent, onCancelEdit }){
  const [form,setForm] = useState({ 
    name: '', 
    email: '', 
    mobileWithCountry: '', 
    password: '' 
  });
  const [error, setError] = useState('');

  // Update form when editingAgent changes
  useEffect(() => {
    console.log('AddAgent useEffect triggered, editingAgent:', editingAgent);
    if (editingAgent) {
      console.log('Setting form with editing agent data:', editingAgent);
      setForm({
        name: editingAgent.name || '',
        email: editingAgent.email || '',
        mobileWithCountry: editingAgent.mobileWithCountry || '',
        password: ''
      });
    } else {
      console.log('Clearing form for new agent');
      setForm({ name: '', email: '', mobileWithCountry: '', password: '' });
    }
    setError('');
  }, [editingAgent]);

  const handle = async e=>{
    e.preventDefault();
    console.log('Form submitted, editingAgent:', editingAgent, 'form:', form);
    try {
      if (editingAgent) {
        // Update existing agent
        console.log('Updating agent:', editingAgent._id);
        const updateData = { ...form };
        if (!updateData.password) delete updateData.password; // Don't update password if empty
        console.log('Update data:', updateData);
        const response = await API.put(`/agents/update-agent/${editingAgent._id}`, updateData);
        console.log('Update response:', response);
        onCancelEdit();
      } else {
        // Add new agent
        console.log('Adding new agent');
        const response = await API.post('/agents/add-agent', form);
        console.log('Add response:', response);
        setForm({ name:'',email:'',mobileWithCountry:'',password:'' });
      }
      onAdded();
      setError('');
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.response?.data?.error || 'Failed to save agent');
    }
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
    setForm({ name: '', email: '', mobileWithCountry: '', password: '' });
    setError('');
    onCancelEdit();
  };

  console.log('AddAgent render - editingAgent:', editingAgent, 'form:', form);

  return (
    <form onSubmit={handle} className="bg-white rounded p-4 shadow sm:mb-4">
      <h3 className="text-xl mb-3">{editingAgent ? 'Edit Agent' : 'Add Agent'}</h3>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <input placeholder="Name" className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
      <input placeholder="Email" className="input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
      <input placeholder="Mobile (+country‑code)" className="input" value={form.mobileWithCountry} onChange={e=>setForm({...form,mobileWithCountry:e.target.value})} required />
      <input type="password" placeholder={editingAgent ? "Password (leave blank to keep current)" : "Password"} className="input" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required={!editingAgent} />
      <div className="flex gap-2">
        <button type="submit" className="btn">{editingAgent ? 'Update Agent' : 'Add Agent'}</button>
        {editingAgent && (
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
