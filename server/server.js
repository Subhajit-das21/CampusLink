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

// ✅ CORS Configuration - Allow frontend
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            process.env.CLIENT_URL
        ].filter(Boolean);
        
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(null, true); // Allow all in development
        }
    },
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

// ✅ Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: 'CampusLink API is running',
        timestamp: new Date().toISOString()
    });
});

// Global System Status (Root)
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

// 404 Catch-all
app.use((req, res) => {
    console.log('❌ 404 Not Found:', req.method, req.originalUrl);
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
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ 
        success: false,
        error: 'Nexus Link Interrupted', 
        message: err.message || 'Internal Server Error'
    });
});

/**
 * 5. Initialization Node
 */
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`
    🚀 CampusLink Backend Initialized
    📡 Port: ${PORT}
    🔗 Base Node: http://localhost:${PORT}
    🔧 Environment: ${process.env.NODE_ENV || 'development'}
    ───────────────────────────────────────
    `);
});

/**
 * 6. System Stability Handlers
 */
process.on('uncaughtException', (err) => {
    console.error(`🛑 Uncaught Exception: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error(`⚠️ Unhandled Rejection: ${err.message}`);
    console.error(err.stack);
    server.close(() => process.exit(1));
});
