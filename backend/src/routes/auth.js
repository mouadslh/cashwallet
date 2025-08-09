import express from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { JWT_SECRET } from '../config.js';

const router = express.Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional().default(''),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/signup', async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.create(data);
    const token = createToken(user._id.toString());
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    if (err?.issues) return res.status(400).json({ message: 'Validation error', issues: err.issues });
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(data.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = createToken(user._id.toString());
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    if (err?.issues) return res.status(400).json({ message: 'Validation error', issues: err.issues });
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).select('_id email name');
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    return res.json({ user });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export default router;