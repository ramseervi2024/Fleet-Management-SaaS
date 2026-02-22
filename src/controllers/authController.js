const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

const generateToken = (id, tenantId, role) => {
    return jwt.sign({ id, tenantId, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// @desc    Register Tenant + Admin User
// @route   POST /api/auth/register-tenant
// @access  Public
const registerTenant = async (req, res) => {
    try {
        const { orgName, orgEmail, orgPhone, adminName, adminEmail, adminPassword } = req.body;

        // Check if tenant already exists
        const existingTenant = await Tenant.findOne({ email: orgEmail });
        if (existingTenant) {
            return res.status(400).json({ success: false, message: 'Organization email already registered.' });
        }

        // Create tenant
        const tenant = await Tenant.create({
            name: orgName,
            email: orgEmail,
            phone: orgPhone,
        });

        // Check if admin email already used globally within the tenant
        const existingUser = await User.findOne({ tenantId: tenant._id, email: adminEmail });
        if (existingUser) {
            await Tenant.findByIdAndDelete(tenant._id);
            return res.status(400).json({ success: false, message: 'Admin email already in use.' });
        }

        // Create admin user
        const user = await User.create({
            tenantId: tenant._id,
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
        });

        const token = generateToken(user._id, tenant._id, user.role);

        res.status(201).json({
            success: true,
            message: 'Organization registered successfully.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            tenant: {
                id: tenant._id,
                name: tenant.name,
                slug: tenant.slug,
                plan: tenant.plan,
            },
        });
    } catch (error) {
        console.error('Register Tenant Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        // Find user across all tenants by email
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'Account is deactivated.' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        const tenant = await Tenant.findById(user.tenantId);
        const token = generateToken(user._id, user.tenantId, user.role);

        res.json({
            success: true,
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
            },
            tenant: tenant
                ? { id: tenant._id, name: tenant.name, slug: tenant.slug, plan: tenant.plan }
                : null,
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Register additional user within a tenant
// @route   POST /api/auth/register-user
// @access  Private (admin only)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        const existingUser = await User.findOne({ tenantId: req.tenantId, email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered in this organization.' });
        }

        // Only admin/superadmin can create admin-level users
        if (role === 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Only superadmin can create admin users.' });
        }

        const user = await User.create({
            tenantId: req.tenantId,
            name,
            email,
            password,
            role: role || 'driver',
            phone,
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            user,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const tenant = await Tenant.findById(req.tenantId);
        res.json({ success: true, user, tenant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all users in tenant
// @route   GET /api/auth/users
// @access  Private (admin, manager)
const getTenantUsers = async (req, res) => {
    try {
        const users = await User.find({ tenantId: req.tenantId }).sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user status
// @route   PATCH /api/auth/users/:id
// @access  Private (admin)
const updateUser = async (req, res) => {
    try {
        const { isActive, role } = req.body;
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            { isActive, role },
            { new: true, runValidators: true }
        );
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { registerTenant, login, registerUser, getMe, getTenantUsers, updateUser };
