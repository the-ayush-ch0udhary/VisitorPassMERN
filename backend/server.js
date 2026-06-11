const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/orgs', require('./routes/orgRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/passes', require('./routes/passRoutes'));
app.use('/api/check-logs', require('./routes/checkLogRoutes'));
app.use('/api/audit-logs', require('./routes/auditLogRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/otp',require('./routes/otpRoutes'));
// Home Route
app.get('/', (req, res) => {
  res.json({
    message: 'Visitor Pass Management System API'
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost//${PORT}`);
});