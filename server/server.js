const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Initialize Express
const app = express();

// 2. Connect Database
connectDB();

// 3. Middlewares
app.use(cors());         // Moves this AFTER 'app' is defined to fix the crash
app.use(express.json()); // Allows the server to accept JSON data
app.use(helmet());       // Adds security headers to your requests

// 4. Test Route
app.get('/', (req, res) => {
  res.json({ message: "CampusLink API is live and luminous!" });
});

// 5. Auth Routes (Required for your new Login/Signup logic)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Service Routes
const serviceRoutes = require('./routes/serviceRoutes');
app.use('/api/services', serviceRoutes);

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});