import express from 'express';
import { z } from 'zod';
import { Transaction } from '../models/Transaction.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = express.Router();

const createSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  amount: z.number().nonnegative(),
  date: z.string().or(z.date()).transform((v) => new Date(v)),
  description: z.string().optional().default(''),
});

const updateSchema = createSchema.partial();

router.use(authenticateJwt);

router.post('/', async (req, res) => {
  try {
    const data = createSchema.parse(req.body);
    const tx = await Transaction.create({ ...data, userId: req.userId });
    return res.status(201).json(tx);
  } catch (err) {
    if (err?.issues) return res.status(400).json({ message: 'Validation error', issues: err.issues });
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || '1'));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || '20')));
    const sortBy = String(req.query.sortBy || 'date');
    const sortOrder = String(req.query.sortOrder || 'desc') === 'asc' ? 1 : -1;

    const filter = { userId: req.userId };
    const { type, category, start, end, minAmount, maxAmount } = req.query;
    if (type && (type === 'income' || type === 'expense')) filter.type = type;
    if (category) filter.category = category;
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = new Date(String(start));
      if (end) filter.date.$lte = new Date(String(end));
    }
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    const sort = { [sortBy]: sortOrder };

    const [docs, total] = await Promise.all([
      Transaction.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
      Transaction.countDocuments(filter),
    ]);

    return res.json({ docs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const tx = await Transaction.findOne({ _id: req.params.id, userId: req.userId });
  if (!tx) return res.status(404).json({ message: 'Not found' });
  return res.json(tx);
});

router.put('/:id', async (req, res) => {
  try {
    const data = updateSchema.parse(req.body);
    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      data,
      { new: true }
    );
    if (!tx) return res.status(404).json({ message: 'Not found' });
    return res.json(tx);
  } catch (err) {
    if (err?.issues) return res.status(400).json({ message: 'Validation error', issues: err.issues });
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const result = await Transaction.deleteOne({ _id: req.params.id, userId: req.userId });
  if (!result.deletedCount) return res.status(404).json({ message: 'Not found' });
  return res.json({ success: true });
});

export default router;