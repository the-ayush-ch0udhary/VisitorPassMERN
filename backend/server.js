const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const reportRoutes = require('./routes/reportRoutes');

// Load environment variables from .env file
dotenv.config();

// Establish MongoDB connection
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON content
app.use(express.urlencoded({ extended: true })); // Body parser for url-encoded forms
app.use('/api/reports', reportRoutes);

// Serve uploaded visitor photos and generated pass PDF badges statically
// This allows the frontend to fetch/display photos and PDFs via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register API Routes
app.use('/api/orgs', require('./routes/orgRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/otp', require('./routes/otpRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/passes', require('./routes/passRoutes'));
app.use('/api/check-logs', require('./routes/checkLogRoutes'));
app.use('/api/audit-logs', require('./routes/auditLogRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Root endpoint for simple health-check
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Visitor Pass Management System API' });
});

// Custom 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(`Global Error Handler: ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected server error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Start Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
