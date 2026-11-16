import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import userRoutes from './routes/user';
import admins from './routes/admins';
import plans from './routes/plans';
import deposits from './routes/deposits';
import withdrawals from './routes/withdrawals';
import gateway_currencies from './routes/gateway_currencies';
import general_settings from './routes/general_settings';

import userAccounts from './routes/userAccounts';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/admins', authenticateToken, admins);
app.use('/api/plans', authenticateToken, plans);
app.use('/api/deposits', authenticateToken, deposits);
app.use('/api/withdrawals', authenticateToken, withdrawals);
app.use('/api/gateway-currencies', gateway_currencies);
app.use('/api/general-settings', general_settings);
app.use('/api/user-accounts', userAccounts);
app.use('/api/spin', authenticateToken, spin);

// Error handler
app.use(errorHandler);

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

export default app;
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import userRoutes from './routes/user';
import admins from './routes/admins';
import plans from './routes/plans';
import deposits from './routes/deposits';
import withdrawals from './routes/withdrawals';
import gateway_currencies from './routes/gateway_currencies';
import general_settings from './routes/general_settings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/admins', authenticateToken, admins);
app.use('/api/plans', authenticateToken, plans);
app.use('/api/deposits', authenticateToken, deposits);
app.use('/api/withdrawals', authenticateToken, withdrawals);
app.use('/api/gateway-currencies', gateway_currencies);
app.use('/api/general-settings', general_settings);

// Error handler
app.use(errorHandler);

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

export default app;
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';

import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import userRoutes from './routes/user';
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/user', authenticateToken, userRoutes);

// Error handler
app.use(errorHandler);

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

export default app;