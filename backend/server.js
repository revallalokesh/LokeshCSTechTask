import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/noteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express();


connectDB();

app.use(cors({ origin: 'https://mnaotp.vercel.app', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notes', notesRoutes);
export default app;