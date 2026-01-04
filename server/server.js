require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

/**
 * 1. Database Connection Hub
 */
connectDB();

/**
 * 2. Security & Utilities Middleware
 */
app.use(helmet()); 
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Essential for handling large Base64 images from the Report page
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev')); 

/**
 * 3. Network Route Registry
 */

// Auth Interface: Identity & Token Exchange
app.use('/api/auth', require('./routes/auth'));

// Service & Map Interface
app.use('/api/services', require('./routes/service'));

// Civic Interface: Infrastructure Report Logging
app.use('/api/reports', require('./routes/report')); 

// Global System Status (Health Check)
app.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'Online', 
        message: 'CampusLink Nexus is live and luminous!',
        telemetry: {
            uptime: Math.floor(process.uptime()) + 's',
            timestamp: new Date()
        }
    });
});

// 404 Catch-all: Handles requests to non-existent API endpoints
app.use((req, res) => {
    res.status(404).json({
        error: 'Node Not Found',
        message: `The path ${req.originalUrl} does not exist in the Nexus registry.`
    });
});

/**
 * 4. Error Interception Node
 */
app.use((err, req, res, next) => {
    console.error(`[NEXUS ERROR]: ${err.message}`);
    
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ 
        error: 'Nexus Link Interrupted', 
        message: err.message || 'Internal Server Error'
    });
});

/**
 * 5. Initialization Node
 */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`
    🚀 CampusLink Backend Initialized
    📡 Port: ${PORT}
    🔗 Base Node: http://localhost:${PORT}
    ───────────────────────────────────────
    `);
});

/**
 * 6. System Stability Handlers
 */
// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.error(`🛑 Uncaught Exception: ${err.message}`);
    process.exit(1);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
    console.error(`⚠️ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});