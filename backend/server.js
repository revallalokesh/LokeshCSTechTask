// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import agentRoutes from './routes/agents.js';

dotenv.config();

const app = express();

// Configure CORS with credentials support
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);

app.listen(process.env.PORT, () => {
  console.log('Server listening', process.env.PORT);
});
