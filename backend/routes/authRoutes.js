import express from 'express';
import { sendOtp, signUp, signIn,logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/logout', logout);
export default router;

