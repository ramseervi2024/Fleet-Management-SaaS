require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./src/config/database');
const swaggerSpec = require('./src/config/swagger');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const tripRoutes = require('./src/routes/tripRoutes');
const maintenanceRoutes = require('./src/routes/maintenanceRoutes');
const fuelLogRoutes = require('./src/routes/fuelLogRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Allow Swagger UI inline scripts
}));

// CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register-tenant', authLimiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Serve Static Frontend
app.use(express.static(path.join(__dirname, 'public')));

// ─── Swagger UI ────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: '🚛 Fleet Management API',
    customCss: `
    .swagger-ui .topbar { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
    .swagger-ui .topbar-wrapper img { display: none; }
    .swagger-ui .topbar-wrapper::before { content: '🚛 Fleet Management API'; color: #38bdf8; font-size: 1.2rem; font-weight: bold; }
    .swagger-ui .info .title { color: #0f172a; }
  `,
    swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        tagsSorter: 'alpha',
    },
}));

// ─── API Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/fuel-logs', fuelLogRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '🚛 Fleet Management API is running',
        version: '1.0.0',
        docs: `/api-docs`,
        timestamp: new Date().toISOString(),
    });
});

// ─── Serve Frontend SPA ────────────────────────────────────────────────────
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// ─── Global Error Handler──────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error.',
    });
});

// ─── Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
    console.log(`\n🚛  Fleet Management SaaS`);
    console.log(`🌐  Server: http://localhost:${PORT}`);
    console.log(`📋  Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`💊  Health: http://localhost:${PORT}/api/health`);
    console.log(`🌍  Env: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
