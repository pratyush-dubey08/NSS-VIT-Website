import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes';
import formRoutes from './routes/formRoutes';
import userRoutes from './routes/userRoutes';
import uploadRoutes from './routes/uploadRoutes';
import resourceRoutes from './routes/resourceRoutes';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Strict CORS configuration
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(helmet());
app.use(helmet({ crossOriginResourcePolicy: false }));

// Serve static files from uploads folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nss-vit-bhopal';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/resources', resourceRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('NSS VIT Bhopal API is running...');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
