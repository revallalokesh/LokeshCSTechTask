import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { parse } from 'csv-parse';
import Agent from '../models/Agent.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();
const upload = multer();

router.use(authMiddleware);

router.post('/add-agent', async (req, res) => {
  try {
    const { name, email, mobileWithCountry, password } = req.body;
    if (!name || !email || !mobileWithCountry || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Check for duplicate email
    const existing = await Agent.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Agent with this email already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    const agent = new Agent({ name, email, mobileWithCountry, passwordHash: hash, assignedTasks: [] });
    await agent.save();
    res.json({ success: true, agent });
  } catch (err) {
    console.error('Add agent error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/upload-list', upload.single('file'), async (req,res)=>{
  try {
    console.log('Upload request received');
    console.log('Request headers:', req.headers);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request file:', req.file ? 'File exists' : 'No file');
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    const buffer = req.file.buffer;
    console.log('Buffer size:', buffer.length);
    
    parse(buffer, { columns:true, trim:true }, async (err, rows)=>{
      if (err) {
        console.error('CSV parse error:', err);
        return res.status(400).json({ error: 'Invalid CSV format. Please check your file structure.' });
      }
      
      console.log('Parsed rows:', rows ? rows.length : 0);
      
      if (!rows || rows.length === 0) {
        console.log('No rows found in CSV');
        return res.status(400).json({ error: 'CSV file is empty or has no valid data.' });
      }
      
      // Validate CSV structure
      const firstRow = rows[0];
      console.log('First row:', firstRow);
      console.log('Required columns check:', {
        FirstName: !!firstRow.FirstName,
        Phone: !!firstRow.Phone,
        Notes: !!firstRow.Notes
      });
      
      if (!firstRow.FirstName || !firstRow.Phone || !firstRow.Notes) {
        console.log('Missing required columns');
        return res.status(400).json({ error: 'CSV must have columns: FirstName, Phone, Notes' });
      }
      
      const records = rows.map(r=>({ firstName:r.FirstName, phone:r.Phone, notes:r.Notes }));
      const agents = await Agent.find();
      
      console.log('Found agents:', agents.length);
      
      if (agents.length === 0) {
        console.log('No agents found');
        return res.status(400).json({ error:'No agents found. Please add agents first.' });
      }
      
      console.log(`Distributing ${records.length} tasks among ${agents.length} agents`);
      
      // Clear existing tasks first
      for (const agent of agents) {
        agent.assignedTasks = [];
        await agent.save();
      }
      
      // Calculate distribution
      const totalTasks = records.length;
      const totalAgents = agents.length;
      const baseTasksPerAgent = Math.floor(totalTasks / totalAgents);
      const extraTasks = totalTasks % totalAgents;
      
      console.log(`Total tasks: ${totalTasks}, Total agents: ${totalAgents}`);
      console.log(`Base tasks per agent: ${baseTasksPerAgent}, Extra tasks: ${extraTasks}`);
      
      let taskIndex = 0;
      
      // Distribute tasks equally
      for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        
        // Calculate tasks for this agent
        // First 'extraTasks' agents get one extra task
        const tasksForThisAgent = baseTasksPerAgent + (i < extraTasks ? 1 : 0);
        
        // Get the slice of tasks for this agent
        const slice = records.slice(taskIndex, taskIndex + tasksForThisAgent);
        
        // Assign tasks to agent
        agent.assignedTasks = slice;
        await agent.save();
        
        console.log(`Agent ${agent.name}: ${slice.length} tasks (${tasksForThisAgent} calculated)`);
        
        // Move to next task index
        taskIndex += tasksForThisAgent;
      }
      
      const updated = await Agent.find();
      console.log('Upload completed successfully');
      res.json({ 
        success: true, 
        agents: updated, 
        message: `Distributed ${totalTasks} tasks among ${totalAgents} agents (${baseTasksPerAgent} base + ${extraTasks} extra)` 
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during file upload' });
  }
});

router.get('/list-agents', async (req,res)=>{
  const agents = await Agent.find();
  res.json({ agents });
});

router.put('/update-agent/:id', async (req, res) => {
  try {
    console.log('Update agent request:', req.params.id, req.body);
    const { name, email, mobileWithCountry, password } = req.body;
    const agentId = req.params.id;
    
    if (!name || !email || !mobileWithCountry) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Name, email, and mobile are required' });
    }
    
    // Check for duplicate email (excluding current agent)
    const existing = await Agent.findOne({ email, _id: { $ne: agentId } });
    if (existing) {
      console.log('Duplicate email found');
      return res.status(400).json({ error: 'Agent with this email already exists' });
    }
    
    const updateData = { name, email, mobileWithCountry };
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }
    
    console.log('Updating agent with data:', updateData);
    const agent = await Agent.findByIdAndUpdate(agentId, updateData, { new: true });
    if (!agent) {
      console.log('Agent not found');
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    console.log('Agent updated successfully:', agent);
    res.json({ success: true, agent });
  } catch (err) {
    console.error('Update agent error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/delete-agent/:id', async (req, res) => {
  try {
    const agentId = req.params.id;
    const agent = await Agent.findByIdAndDelete(agentId);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json({ success: true, message: 'Agent deleted successfully' });
  } catch (err) {
    console.error('Delete agent error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reassign-tasks', async (req, res) => {
  try {
    const agents = await Agent.find();
    if (agents.length === 0) {
      return res.status(400).json({ error: 'No agents found' });
    }

    // Collect all tasks from all agents
    let allTasks = [];
    agents.forEach(agent => {
      if (agent.assignedTasks && agent.assignedTasks.length > 0) {
        allTasks = allTasks.concat(agent.assignedTasks);
      }
    });

    if (allTasks.length === 0) {
      return res.status(400).json({ error: 'No tasks to reassign' });
    }

    console.log(`Reassigning ${allTasks.length} tasks among ${agents.length} agents`);

    // Clear all tasks from all agents
    for (const agent of agents) {
      agent.assignedTasks = [];
      await agent.save();
    }

    // Calculate distribution
    const totalTasks = allTasks.length;
    const totalAgents = agents.length;
    const baseTasksPerAgent = Math.floor(totalTasks / totalAgents);
    const extraTasks = totalTasks % totalAgents;
    
    console.log(`Total tasks: ${totalTasks}, Total agents: ${totalAgents}`);
    console.log(`Base tasks per agent: ${baseTasksPerAgent}, Extra tasks: ${extraTasks}`);
    
    let taskIndex = 0;

    // Redistribute tasks equally
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      
      // Calculate tasks for this agent
      // First 'extraTasks' agents get one extra task
      const tasksForThisAgent = baseTasksPerAgent + (i < extraTasks ? 1 : 0);
      
      // Get the slice of tasks for this agent
      const slice = allTasks.slice(taskIndex, taskIndex + tasksForThisAgent);
      
      // Assign tasks to agent
      agent.assignedTasks = slice;
      await agent.save();
      
      console.log(`Agent ${agent.name}: ${slice.length} tasks (${tasksForThisAgent} calculated)`);
      
      // Move to next task index
      taskIndex += tasksForThisAgent;
    }

    const updated = await Agent.find();
    res.json({ 
      success: true, 
      agents: updated, 
      message: `Reassigned ${totalTasks} tasks among ${totalAgents} agents (${baseTasksPerAgent} base + ${extraTasks} extra)` 
    });
  } catch (err) {
    console.error('Reassign tasks error:', err);
    res.status(500).json({ error: 'Server error during task reassignment' });
  }
});

export default router;
