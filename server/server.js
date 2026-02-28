const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL, // set this to your Vercel URL in production
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/diet', require('./routes/diet'));
app.use('/api/exercise', require('./routes/exercise'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'FitLife API running' }));

// Sync database & start server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ MySQL database synced');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('Make sure MySQL is running and credentials in .env are correct');
    process.exit(1);
  });
