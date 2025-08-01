import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);
  
  if (!authHeader) {
    console.log('No authorization header');
    return res.status(401).json({ error: 'No authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token in authorization header');
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'No secret');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
}
