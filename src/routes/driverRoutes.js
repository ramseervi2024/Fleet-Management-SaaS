const express = require('express');
const router = express.Router();
const { getDrivers, getDriver, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Driver management
 */

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Get all drivers (tenant-scoped)
 *     tags: [Drivers]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, on-trip, off-duty, suspended]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Driver list with pagination
 *   post:
 *     summary: Create a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, licenseNumber, licenseType, licenseExpiry]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ramesh Kumar"
 *               phone:
 *                 type: string
 *                 example: "+919876543210"
 *               email:
 *                 type: string
 *                 example: "ramesh@acme.com"
 *               licenseNumber:
 *                 type: string
 *                 example: "MH1234567890"
 *               licenseType:
 *                 type: string
 *                 enum: [A, B, C, D, E]
 *                 example: "B"
 *               licenseExpiry:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *     responses:
 *       201:
 *         description: Driver created
 */
router.route('/').get(protect, getDrivers).post(protect, authorize('admin', 'manager', 'superadmin'), createDriver);

/**
 * @swagger
 * /api/drivers/{id}:
 *   get:
 *     summary: Get a driver by ID
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver data
 *   put:
 *     summary: Update a driver
 *     tags: [Drivers]
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
 *               status:
 *                 type: string
 *                 enum: [available, on-trip, off-duty, suspended]
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete (deactivate) a driver
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.route('/:id')
    .get(protect, getDriver)
    .put(protect, authorize('admin', 'manager', 'superadmin'), updateDriver)
    .delete(protect, authorize('admin', 'superadmin'), deleteDriver);

module.exports = router;
