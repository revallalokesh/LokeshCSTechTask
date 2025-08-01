// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import agentRoutes from './routes/agents.js';

dotenv.config();

const app = express();
// https://lokesh-cs-tech-task.vercel.app
// Configure CORS with credentials support
app.use(cors({
  origin: [
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    console.log('Database URL:', process.env.MONGO_URI);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    console.error('Database URL:', process.env.MONGO_URI);
  });

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);



app.get('/', (req, res) => {
  res.send('API is running...');
});


app.listen(process.env.PORT, () => {
  console.log('Server listening', process.env.PORT);
});
