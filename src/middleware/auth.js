const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        // Development Bypass
        if (token === 'dev-bypass-token') {
            const demoAdmin = await User.findOne({ email: 'admin@demo.com' });
            if (demoAdmin) {
                req.user = demoAdmin;
                req.tenantId = demoAdmin.tenantId;
                return next();
            }
        }




        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'User no longer exists.' });
        }

        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'Account is deactivated.' });
        }

        req.user = user;
        req.tenantId = user.tenantId;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired.' });
        }
        res.status(500).json({ success: false, message: 'Server error during authentication.' });
    }
};

module.exports = { protect };
