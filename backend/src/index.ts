import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || '*',
    'https://cricklog.vercel.app',
    'https://cricklog-a8ch1saj6-arun-nexs-projects.vercel.app',
    'https://cricklog-nasyk2cuf-arun-nexs-projects.vercel.app',
    'https://cricklog-2dk4.vercel.app',
    /^https:\/\/cricklog-.*\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle CORS preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.status(200).json({
    status: 'OK',
    message: 'Cricklog API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Import routes
import teamsRouter from './routes/teams';
import matchesRouter from './routes/matches';
import scoringRouter from './routes/scoring';

// API routes
app.get('/api/health', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.status(200).json({
    status: 'OK',
    message: 'Cricklog API is healthy',
    database: 'Connected',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.status(200).json({
    message: 'Cricklog API is working!',
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Team management routes
app.use('/api/teams', teamsRouter);

// Match management routes
app.use('/api/matches', matchesRouter);

// Live scoring routes
app.use('/api/scoring', scoringRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cricklog API server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
