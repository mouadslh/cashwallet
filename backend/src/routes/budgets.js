import express from 'express';
import dayjs from 'dayjs';
import { z } from 'zod';
import { authenticateJwt } from '../middleware/auth.js';
import { Budget } from '../models/Budget.js';
import { Transaction } from '../models/Transaction.js';

const router = express.Router();
router.use(authenticateJwt);

const upsertSchema = z.object({
  category: z.string().min(1),
  monthlyLimit: z.number().nonnegative(),
});

router.get('/', async (req, res) => {
  const budgets = await Budget.find({ userId: req.userId }).lean();
  const start = dayjs().startOf('month').toDate();
  const end = dayjs().endOf('month').toDate();
  const spentByCategory = await Transaction.aggregate([
    { $match: { userId: req.userId, type: 'expense', date: { $gte: start, $lte: end } } },
    { $group: { _id: '$category', spent: { $sum: '$amount' } } },
  ]);
  const map = new Map(spentByCategory.map((x) => [x._id, x.spent]));
  const withUsage = budgets.map((b) => {
    const spent = map.get(b.category) || 0;
    const percent = b.monthlyLimit === 0 ? 0 : Math.min(100, Math.round((spent / b.monthlyLimit) * 100));
    return { ...b, spent, percent };
  });
  return res.json(withUsage);
});

router.post('/', async (req, res) => {
  try {
    const data = upsertSchema.parse(req.body);
    const existing = await Budget.findOneAndUpdate(
      { userId: req.userId, category: data.category },
      { $set: { monthlyLimit: data.monthlyLimit } },
      { new: true, upsert: true }
    );
    return res.status(201).json(existing);
  } catch (err) {
    if (err?.issues) return res.status(400).json({ message: 'Validation error', issues: err.issues });
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:category', async (req, res) => {
  const result = await Budget.deleteOne({ userId: req.userId, category: req.params.category });
  if (!result.deletedCount) return res.status(404).json({ message: 'Not found' });
  return res.json({ success: true });
});

export default router;