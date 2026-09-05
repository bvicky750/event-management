import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { config } from './config/env.js';
import { testConnection } from './config/db.js';
import apiRoutes from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = config.port;

// Security & Parsing Middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.use(cors({
  origin: config.corsOrigin === '*' ? '*' : config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: dbStatus ? 'ok' : 'degraded',
    message: 'T&P Club Event Management Backend Running',
    database: dbStatus ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Mount Main API Routes
app.use('/api', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  // Test MySQL connection on boot
  await testConnection();

  app.listen(PORT, () => {
    console.log(`[Server] T&P Club Backend listening on http://localhost:${PORT}`);
    console.log(`[Server] Environment: ${config.nodeEnv}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
  });
};

const isTest = process.env.NODE_ENV === 'test' || process.argv.some(arg => arg.includes('test'));

if (!isTest) {
  startServer();
}

export default app;
