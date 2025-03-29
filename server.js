const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const cors = require('cors');
const trackingService = require('./service/trackingService');

// Import models
require('./models/User');
require('./models/Vehicle');
require('./models/Bin');
require('./models/ContactUs');
require('./models/Product');

require('./config/passport');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Database connection with retry logic
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenbin', {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        maxAge: 86400 // 24 hours
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/web', require('./routes/webauth.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/bins', require('./routes/bin.routes'));
app.use('/admin', require('./routes/admin.routes'));

// Error handling in development
if (process.env.NODE_ENV === 'development') {
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(err.status || 500).json({
            status: 'error',
            message: err.message,
            stack: err.stack
        });
    });
} else {
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(err.status || 500).json({
            status: 'error',
            message: 'Internal server error'
        });
    });
}

const PORT = process.env.PORT || 3000;

trackingService.startTrackingService();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 