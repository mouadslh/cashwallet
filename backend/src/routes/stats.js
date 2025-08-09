import express from 'express';
import dayjs from 'dayjs';
import { authenticateJwt } from '../middleware/auth.js';
import { Transaction } from '../models/Transaction.js';

const router = express.Router();
router.use(authenticateJwt);

router.get('/overview', async (req, res) => {
  try {
    const { start, end } = { start: req.query.start, end: req.query.end };
    const match = { userId: req.userId };
    if (start || end) {
      match.date = {};
      if (start) match.date.$gte = new Date(String(start));
      if (end) match.date.$lte = new Date(String(end));
    }

    const pipeline = [
      { $match: match },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ];

    const byType = await Transaction.aggregate(pipeline);
    const totalIncome = byType.find((x) => x._id === 'income')?.total || 0;
    const totalExpense = byType.find((x) => x._id === 'expense')?.total || 0;

    const byCategory = await Transaction.aggregate([
      { $match: { ...match, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);

    return res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      expensesByCategory: byCategory.map((x) => ({ category: x._id, total: x.total })),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/line-balance', async (req, res) => {
  try {
    const start = req.query.start ? dayjs(String(req.query.start)).startOf('day') : null;
    const end = req.query.end ? dayjs(String(req.query.end)).endOf('day') : null;

    const rangeMatch = { userId: req.userId };
    if (start || end) {
      rangeMatch.date = {};
      if (start) rangeMatch.date.$gte = start.toDate();
      if (end) rangeMatch.date.$lte = end.toDate();
    }

    const txs = await Transaction.find(rangeMatch).sort({ date: 1 }).lean();

    let startingBalance = 0;
    if (start) {
      const prior = await Transaction.aggregate([
        { $match: { userId: req.userId, date: { $lt: start.toDate() } } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]);
      const inc = prior.find((x) => x._id === 'income')?.total || 0;
      const exp = prior.find((x) => x._id === 'expense')?.total || 0;
      startingBalance = inc - exp;
    }

    let running = startingBalance;
    const points = [];
    for (const t of txs) {
      running += t.type === 'income' ? t.amount : -t.amount;
      points.push({ date: t.date, balance: running });
    }

    return res.json({ startingBalance, points });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/monthly', async (req, res) => {
  try {
    const year = Number(req.query.year || dayjs().year());
    const start = dayjs().year(year).startOf('year').toDate();
    const end = dayjs().year(year).endOf('year').toDate();

    const data = await Transaction.aggregate([
      { $match: { userId: req.userId, date: { $gte: start, $lte: end } } },
      { $group: { _id: { month: { $month: '$date' }, type: '$type' }, total: { $sum: '$amount' } } },
    ]);

    const result = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, income: 0, expense: 0 }));
    for (const row of data) {
      const idx = row._id.month - 1;
      if (row._id.type === 'income') result[idx].income = row.total;
      if (row._id.type === 'expense') result[idx].expense = row.total;
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;