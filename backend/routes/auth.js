// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ email, passwordHash });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log('Comparing password with hash:', user.passwordHash ? 'Hash exists' : 'No hash');
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    console.log('Login successful, token generated');
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Temporary endpoint to create admin user (REMOVE AFTER CREATING ADMIN)
router.post('/create-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      email: 'admin@example.com',
      passwordHash: passwordHash
    });

    await adminUser.save();
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Temporary endpoint to list all users (REMOVE AFTER DEBUGGING)
router.get('/list-users', async (req, res) => {
  try {
    const users = await User.find({}, { email: 1, _id: 1 });
    res.json({ users });
  } catch (err) {
    console.error('Error listing users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check admin user exists
router.get('/check-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ email: 'admin@example.com' });
    res.json({ 
      adminExists: !!admin,
      message: admin ? 'Admin user exists' : 'Admin user not found'
    });
  } catch (err) {
    console.error('Error checking admin:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
