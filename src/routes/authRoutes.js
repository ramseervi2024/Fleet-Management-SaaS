const express = require('express');
const router = express.Router();
const {
    registerTenant, login, registerUser, getMe, getTenantUsers, updateUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & Access Control
 */

/**
 * @swagger
 * /api/auth/register-tenant:
 *   post:
 *     summary: Register a new organization (tenant) + admin user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orgName, orgEmail, adminName, adminEmail, adminPassword]
 *             properties:
 *               orgName:
 *                 type: string
 *                 example: "Acme Fleet Corp"
 *               orgEmail:
 *                 type: string
 *                 example: "admin@acmefleet.com"
 *               orgPhone:
 *                 type: string
 *                 example: "+1234567890"
 *               adminName:
 *                 type: string
 *                 example: "John Doe"
 *               adminEmail:
 *                 type: string
 *                 example: "john.doe@acmefleet.com"
 *               adminPassword:
 *                 type: string
 *                 example: "SecurePass123"
 *     responses:
 *       201:
 *         description: Tenant and admin registered successfully
 *       400:
 *         description: Validation error or duplicate
 */
router.post('/register-tenant', registerTenant);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@acmefleet.com"
 *               password:
 *                 type: string
 *                 example: "SecurePass123"
 *     responses:
 *       200:
 *         description: Successful login with JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Not authenticated
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/auth/register-user:
 *   post:
 *     summary: Register a new user within your organization
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Smith"
 *               email:
 *                 type: string
 *                 example: "jane@acmefleet.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               role:
 *                 type: string
 *                 enum: [admin, manager, driver]
 *                 example: "driver"
 *               phone:
 *                 type: string
 *                 example: "+9876543210"
 *     responses:
 *       201:
 *         description: User created
 *       403:
 *         description: Insufficient permissions
 */
router.post('/register-user', protect, authorize('admin', 'superadmin'), registerUser);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users in your organization
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', protect, authorize('admin', 'manager', 'superadmin'), getTenantUsers);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   patch:
 *     summary: Update user status or role
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *               role:
 *                 type: string
 *                 enum: [admin, manager, driver]
 *     responses:
 *       200:
 *         description: User updated
 */
router.patch('/users/:id', protect, authorize('admin', 'superadmin'), updateUser);

module.exports = router;
