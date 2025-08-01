// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth.js';
import agentRoutes from './routes/agents.js';
import User from './models/User.js';

dotenv.config();

const app = express();

// Configure CORS with credentials support
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://lokesh-cs-tech-task.vercel.app',
    'https://lokesh-cs-tech-task.vercel.app/',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());

// Function to create admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        email: 'admin@example.com',
        passwordHash: passwordHash
      });
      
      await adminUser.save();
      console.log('Admin user created successfully in deployed environment');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected Successfully');
    console.log('Database URL:', process.env.MONGO_URI);
    
    // Create admin user after successful database connection
    await createAdminUser();
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasMongoUri: !!process.env.MONGO_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      port: process.env.PORT
    }
  });
});

// Test endpoint to verify backend is working
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    env: {
      hasMongoUri: !!process.env.MONGO_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      port: process.env.PORT
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log('Server listening', process.env.PORT);
});
