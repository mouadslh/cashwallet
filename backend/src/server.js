import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CLIENT_ORIGIN, MONGODB_URI, PORT, NODE_ENV } from './config.js';
import authRoutes from './routes/auth.js';
import txRoutes from './routes/transactions.js';
import statsRoutes from './routes/stats.js';
import budgetRoutes from './routes/budgets.js';
import devRoutes from './routes/dev.js';

let memoryServer = null;

async function connectDatabase() {
  try {
    if (MONGODB_URI) {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
    } else {
      memoryServer = await MongoMemoryServer.create();
      const uri = memoryServer.getUri();
      await mongoose.connect(uri);
      console.log('Connected to in-memory MongoDB');
    }
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
}

async function start() {
  await connectDatabase();

  const app = express();
  app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ ok: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/transactions', txRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/budgets', budgetRoutes);

  if (NODE_ENV !== 'production') {
    app.use('/api/dev', devRoutes);
  }

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  });

  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

start();