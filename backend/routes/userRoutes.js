import express from 'express';
import verifyUser from '../middleware/verifyUser.js';
import User from '../models/User.js';
import Note from '../models/Note.js';

const router = express.Router();

router.get('/', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-otp');
    const notes = await Note.find({ userId: req.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user, notes });
  } catch (err) {
    console.error('GET /api/user failed:', err);
    res.status(500).json({ message: 'Failed to load user data', error: err.message });
  }
});

router.get('/dashboard', verifyUser, async (req, res) => {
  try {
    const userData = { name: 'Lokesh', role: 'User' };
    res.status(200).json(userData);
  } catch (error) {
    console.error('GET /api/user/dashboard failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
