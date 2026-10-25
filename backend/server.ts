import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes';
import formRoutes from './routes/formRoutes';
import userRoutes from './routes/userRoutes';
import uploadRoutes from './routes/uploadRoutes';
import resourceRoutes from './routes/resourceRoutes';
import volunteerFormRoutes from './routes/volunteerFormRoutes';
import contactRoutes from './routes/contactRoutes';
import attendanceIssueRoutes from './routes/attendanceIssueRoutes';
import galleryRoutes from './routes/galleryRoutes';

dotenv.config();

// Critical Environment Validation
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ WARNING: JWT_SECRET environment variable is not defined! Using security fallback.');
}

const app: Express = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 5000;

// Gzip Compression for 4x faster API responses
app.use(compression());

// Body parser with safe payload limit to prevent memory exhaustion DoS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Comprehensive Helmet Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    xContentTypeOptions: true,
    xFrameOptions: { action: 'deny' },
    xXssProtection: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  })
);

// Strict Rate Limiting: Brute Force & DoS Protection
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // Limit login attempts to 25 per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again after 15 minutes.' }
});

app.use('/api', generalApiLimiter);
app.use('/api/auth/login', authLimiter);

// Robust CORS configuration supporting localhost, Vercel preview/production, and custom domain
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://nss-vit-website.onrender.com',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // Allow configured origins or any vercel.app preview deployment
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('CORS access blocked by security policy.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Serve static files safely from uploads folder
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  },
  express.static(uploadDir)
);

// MongoDB Connection with optimized pooling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nss-vit-bhopal';

mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ Connected securely to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/volunteer-forms', volunteerFormRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/attendance-issues', attendanceIssueRoutes);
app.use('/api/gallery', galleryRoutes);

// Health check / keep-alive ping endpoint (Render cold-start defense)
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'NSS VIT Bhopal Backend API', timestamp: new Date().toISOString() });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

// Production Security Error Handler (No stack trace leaks)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err.message);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running securely at http://localhost:${port}`);
});
