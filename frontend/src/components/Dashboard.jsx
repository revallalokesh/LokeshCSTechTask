import React,{useEffect,useState} from 'react';
import API from '../api.js';
import AddAgent from './AddAgent.jsx';
import UploadList from './UploadList.jsx';

export default function Dashboard({ onLogout }){
  const [agents,setAgents] = useState([]);
  const [editingAgent, setEditingAgent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [reassignLoading, setReassignLoading] = useState(false);
  const [reassignMessage, setReassignMessage] = useState('');
  
  const fetch = async()=>{ const { data } = await API.get('/agents/list-agents'); setAgents(data.agents); };
  useEffect(()=>{ fetch(); }, []);

  // Debug editingAgent state changes
  useEffect(() => {
    console.log('Dashboard - editingAgent changed:', editingAgent);
  }, [editingAgent]);

  const handleEdit = (agent) => {
    console.log('Edit button clicked for agent:', agent);
    setEditingAgent(agent);
  };

  const handleCancelEdit = () => {
    console.log('Cancel edit clicked');
    setEditingAgent(null);
  };

  const handleDelete = async (agentId) => {
    try {
      await API.delete(`/agents/delete-agent/${agentId}`);
      fetch();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleReassignTasks = async () => {
    try {
      setReassignLoading(true);
      setReassignMessage('');
      const response = await API.post('/agents/reassign-tasks');
      await fetch();
      setReassignMessage(response.data.message || 'Tasks reassigned successfully!');
      setTimeout(() => setReassignMessage(''), 3000);
    } catch (err) {
      console.error('Reassign error:', err);
      setReassignMessage(err.response?.data?.error || 'Failed to reassign tasks');
      setTimeout(() => setReassignMessage(''), 5000);
    } finally {
      setReassignLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl">Dashboard</h1>
          <button onClick={onLogout} className="btn-red">Logout</button>
        </div>
        <AddAgent onAdded={fetch} editingAgent={editingAgent} onCancelEdit={handleCancelEdit}/>
        <UploadList onUploaded={fetch}/>
        
        {/* Task Reassignment Section */}
        <div className="bg-white rounded p-4 shadow sm:mb-4">
          <h3 className="text-xl mb-3">Task Management</h3>
          {reassignMessage && (
            <div className={`mb-3 p-2 rounded ${reassignMessage.includes('error') || reassignMessage.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {reassignMessage}
            </div>
          )}
          <button 
            onClick={handleReassignTasks}
            disabled={reassignLoading}
            className={`bg-green-600 text-white px-4 py-2 rounded ${reassignLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
          >
            {reassignLoading ? 'Reassigning...' : 'Reassign All Tasks'}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Redistribute all tasks equally among current agents
          </p>
        </div>
        
        <div>
          <h3 className="text-xl mt-6 mb-3">Agents & Tasks ({agents.length} agents)</h3>
          {agents.length === 0 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No agents found. Please add at least one agent before uploading tasks.
            </div>
          )}
          {agents.map(a => (
            <div key={a._id} className="bg-white rounded p-4 shadow mb-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{a.name} ({a.email})</h4>
                  <p className="text-sm text-gray-600">Mobile: {a.mobileWithCountry}</p>
                  <p className="text-sm text-gray-600 mb-2">Tasks: {a.assignedTasks?.length || 0}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(a)} 
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(a._id)} 
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {showDeleteConfirm === a._id && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                  <p className="text-red-700 mb-2">Are you sure you want to delete this agent?</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDelete(a._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Yes, Delete
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <ul className="list-disc ml-5 mt-2">
                {(a.assignedTasks?.length > 0)
                  ? a.assignedTasks.map((t,i)=>(
                      <li key={i}>{t.firstName} – {t.phone} – {t.notes}</li> ))
                  : <li className="text-gray-500">No tasks assigned</li>}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
