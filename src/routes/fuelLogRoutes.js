const express = require('express');
const router = express.Router();
const { getFuelLogs, getFuelLog, createFuelLog, updateFuelLog, deleteFuelLog } = require('../controllers/fuelLogController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

/**
 * @swagger
 * tags:
 *   name: Fuel Logs
 *   description: Fuel consumption tracking
 */

/**
 * @swagger
 * /api/fuel-logs:
 *   get:
 *     summary: Get all fuel logs (tenant-scoped)
 *     tags: [Fuel Logs]
 *     parameters:
 *       - in: query
 *         name: vehicleId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Fuel log list
 *   post:
 *     summary: Create a fuel log entry
 *     tags: [Fuel Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehicle, fuelType, quantity, pricePerUnit, odometer]
 *             properties:
 *               vehicle:
 *                 type: string
 *                 example: "65a1b2c3d4e5f6g7h8i9j0k1"
 *               driver:
 *                 type: string
 *                 example: "65a1b2c3d4e5f6g7h8i9j0k2"
 *               fuelType:
 *                 type: string
 *                 enum: [petrol, diesel, electric, cng, lpg]
 *                 example: "diesel"
 *               quantity:
 *                 type: number
 *                 example: 45.5
 *               unit:
 *                 type: string
 *                 enum: [liters, gallons, kwh]
 *                 example: "liters"
 *               pricePerUnit:
 *                 type: number
 *                 example: 95.5
 *               odometer:
 *                 type: number
 *                 example: 56000
 *               station:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "HP Petrol Pump - Andheri"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-02-22T09:00:00Z"
 *     responses:
 *       201:
 *         description: Fuel log created
 */
router.route('/').get(protect, getFuelLogs).post(protect, authorize('admin', 'manager', 'driver', 'superadmin'), createFuelLog);

/**
 * @swagger
 * /api/fuel-logs/{id}:
 *   get:
 *     summary: Get fuel log by ID
 *     tags: [Fuel Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fuel log data
 *   put:
 *     summary: Update a fuel log
 *     tags: [Fuel Logs]
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
 *               quantity:
 *                 type: number
 *               pricePerUnit:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete a fuel log
 *     tags: [Fuel Logs]
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
    .get(protect, getFuelLog)
    .put(protect, authorize('admin', 'manager', 'superadmin'), updateFuelLog)
    .delete(protect, authorize('admin', 'superadmin'), deleteFuelLog);

module.exports = router;
