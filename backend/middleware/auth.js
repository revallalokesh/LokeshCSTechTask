import jwt from 'jsonwebtoken';
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error:'No token' });
  try {
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Add this before jwt.sign
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ error:'Invalid token' }); }
}
