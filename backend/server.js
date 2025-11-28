// Load environment variables
// In production (Render), environment variables are set directly, no .env file needed
// In development, load from .env file
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Only load .env file in development (Render sets env vars directly in production)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: join(__dirname, '.env') });
}

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import bookingsRoutes from './routes/bookings.js';
import messagesRoutes from './routes/messages.js';
import jobsRoutes from './routes/jobs.js';

const app = express();

// PORT configuration - Render requires process.env.PORT
const PORT = process.env.PORT || 4000;

// CORS configuration - allow multiple origins for development and production
const allowedOrigins = [
  'https://poc-kwpr.vercel.app', // Production Vercel frontend
  process.env.FRONTEND_URL, // Environment variable override
  'http://localhost:3000', // Local development
  'http://localhost:3001', // Alternative local port
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (process.env.NODE_ENV !== 'production') {
      // In development, allow all origins for easier testing
      callback(null, true);
    } else {
      // In production, only allow specified origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/jobs', jobsRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
});

