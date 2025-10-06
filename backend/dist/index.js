"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.API_PORT || 4000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        process.env.CORS_ORIGIN || '*',
        'https://cricklog.vercel.app',
        'https://cricklog-a8ch1saj6-arun-nexs-projects.vercel.app',
        'https://cricklog-nasyk2cuf-arun-nexs-projects.vercel.app',
        'https://cricklog-2dk4.vercel.app',
        /^https:\/\/cricklog-.*\.vercel\.app$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Handle CORS preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(200).json({
        status: 'OK',
        message: 'Cricklog API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// Import routes
const teams_1 = __importDefault(require("./routes/teams"));
const matches_1 = __importDefault(require("./routes/matches"));
const scoring_1 = __importDefault(require("./routes/scoring"));
const playerStats_1 = __importDefault(require("./routes/playerStats"));
const matchHistory_1 = __importDefault(require("./routes/matchHistory"));
// API routes
app.get('/api/health', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(200).json({
        status: 'OK',
        message: 'Cricklog API is healthy',
        database: 'Connected',
        timestamp: new Date().toISOString()
    });
});
// Test endpoint
app.get('/api/test', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(200).json({
        message: 'Cricklog API is working!',
        environment: process.env.NODE_ENV || 'development',
        port: PORT
    });
});
// Team management routes
app.use('/api/teams', teams_1.default);
// Match management routes
app.use('/api/matches', matches_1.default);
// Live scoring routes
app.use('/api/scoring', scoring_1.default);
// Player statistics routes
app.use('/api/player-stats', playerStats_1.default);
// Match history routes
app.use('/api/match-history', matchHistory_1.default);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Cricklog API server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=index.js.map