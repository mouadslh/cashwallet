import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MONGODB_URI } from '../src/config.js';
import { User } from '../src/models/User.js';
import { Transaction } from '../src/models/Transaction.js';
import { Budget } from '../src/models/Budget.js';

async function connect() {
  if (MONGODB_URI) {
    await mongoose.connect(MONGODB_URI);
  } else {
    const mem = await MongoMemoryServer.create();
    const uri = mem.getUri();
    await mongoose.connect(uri);
  }
}

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

async function seed() {
  await connect();
  await Promise.all([User.deleteMany({}), Transaction.deleteMany({}), Budget.deleteMany({})]);

  const user = await User.create({ email: 'demo@example.com', password: 'password', name: 'Demo User' });
  const categories = ['Food', 'Rent', 'Travel', 'Shopping', 'Utilities', 'Health', 'Entertainment'];

  const today = dayjs();
  const start = today.subtract(5, 'month').startOf('month');

  const txs = [];
  for (let m = 0; m < 6; m++) {
    const month = start.add(m, 'month');

    txs.push({
      userId: user._id,
      type: 'income',
      category: 'Salary',
      amount: 3000 + randomBetween(-100, 200),
      date: month.startOf('month').add(1, 'day').toDate(),
      description: 'Monthly salary',
    });

    const num = 30 + Math.floor(Math.random() * 20);
    for (let i = 0; i < num; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const amount = randomBetween(5, 120);
      const day = month.date(1 + Math.floor(Math.random() * 27));
      txs.push({
        userId: user._id,
        type: 'expense',
        category: cat,
        amount,
        date: day.toDate(),
        description: `${cat} expense`,
      });
    }
  }

  await Transaction.insertMany(txs);

  await Budget.insertMany([
    { userId: user._id, category: 'Food', monthlyLimit: 400 },
    { userId: user._id, category: 'Travel', monthlyLimit: 200 },
    { userId: user._id, category: 'Shopping', monthlyLimit: 300 },
  ]);

  console.log('Seed complete. Demo user: demo@example.com / password');
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});