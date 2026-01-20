"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables first
dotenv_1.default.config();
const database_1 = require("./config/database");
const passport_1 = require("./config/passport");
const auth_1 = require("./middleware/auth");
const auth_2 = __importDefault(require("./routes/auth"));
const movies_1 = __importDefault(require("./routes/movies"));
const recommendations_1 = __importDefault(require("./routes/recommendations"));
const movieNights_1 = __importDefault(require("./routes/movieNights"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:5173',
    'http://localhost:5174'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
// Rate limiting - more lenient for development
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute for development
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '200'), // 200 requests per minute
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Passport initialization
app.use(passport_1.passport.initialize());
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/auth', auth_2.default);
app.use('/api/movies', movies_1.default);
app.use('/api/recommendations', recommendations_1.default);
app.use('/api/movie-nights', movieNights_1.default);
// Google OAuth routes
app.get('/api/auth/google', passport_1.passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/google/callback', passport_1.passport.authenticate('google', { session: false }), (req, res) => {
    const token = (0, auth_1.generateToken)(req.user._id.toString());
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});
// Apple Sign In routes
app.get('/api/auth/apple', passport_1.passport.authenticate('apple'));
app.post('/api/auth/apple/callback', passport_1.passport.authenticate('apple', { session: false }), (req, res) => {
    const token = (0, auth_1.generateToken)(req.user._id.toString());
    res.json({ token });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, database_1.connectToDb)();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map