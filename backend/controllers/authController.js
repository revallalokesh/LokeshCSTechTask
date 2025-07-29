import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendOTP } from '../utils/sendOtp.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, otp });
    } else {
      user.otp = otp;
    }
    await user.save();

    await sendOTP(email, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

export const signUp = async (req, res) => {
  const { name, dob, email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.name = name;
    user.dob = new Date(dob);
    user.otp = null;
    await user.save();

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'None',
      secure: true,
    }).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

export const signIn = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (!user.name || !user.dob) {
      return res.status(400).json({ message: 'Please sign up before logging in.' });
    }

    user.otp = null;
    await user.save();

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'None',
      secure: true,
    }).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};