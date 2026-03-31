import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import riskRoutes from './routes/riskRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import bodyExplorerRoutes from './routes/bodyExplorerRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import walkEarnRoutes from './routes/walkEarnRoutes.js';
import forecastRoutes from './routes/forecastRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
connectDB();

// ==================== MIDDLEWARE ====================

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    const isLocalhostDevOrigin = /^http:\/\/localhost:\d+$/.test(origin || '');
    if (!origin || allowedOrigins.includes(origin) || isLocalhostDevOrigin) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== ROUTES ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Healance AI Backend is running 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health-data', healthRoutes);
app.use('/api/risk-prediction', riskRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/body-explorer', bodyExplorerRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/walk-earn', walkEarnRoutes);
app.use('/api/walkearn', walkEarnRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notifications', notificationRoutes);

// ==================== ERROR HANDLING ====================

app.use(notFound);
app.use(errorHandler);

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\nHealance AI backend running on port ${PORT}...`);
});

export default app;
