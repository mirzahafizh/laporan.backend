const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const laporanRoutes = require('./routes/laporanRoutes'); // Import laporan routes
const sequelize = require('./config/config'); // Import Sequelize config

const app = express();

// CORS Configuration (allow specific domain)
const corsOptions = {
  origin: 'https://renisanawasena.online', // Specify the allowed domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions)); // Enable CORS with options

// Middleware
app.use(bodyParser.json()); // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded requests

// Routes
app.use('/api', userRoutes); // User routes prefixed with '/api'
app.use('/api', laporanRoutes); // Laporan routes prefixed with '/api'

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the User Management API');
});

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Endpoint not found!',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred!',
    error: err.message,
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
