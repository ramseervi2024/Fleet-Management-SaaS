const express = require('express');
const router = express.Router();
const { getTrips, getTrip, createTrip, updateTrip, deleteTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Trip & Route management
 */

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips (tenant-scoped)
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, in-progress, completed, cancelled, delayed]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Trip list
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehicle, driver, origin, destination, scheduledStart]
 *             properties:
 *               vehicle:
 *                 type: string
 *                 description: Vehicle ObjectId
 *                 example: "65a1b2c3d4e5f6g7h8i9j0k1"
 *               driver:
 *                 type: string
 *                 description: Driver ObjectId
 *                 example: "65a1b2c3d4e5f6g7h8i9j0k2"
 *               origin:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: "Mumbai Warehouse, Andheri East"
 *               destination:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: "Delhi Hub, Connaught Place"
 *               scheduledStart:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-02-25T09:00:00Z"
 *               distance:
 *                 type: number
 *                 example: 1400
 *     responses:
 *       201:
 *         description: Trip created
 */
router.route('/').get(protect, getTrips).post(protect, authorize('admin', 'manager', 'superadmin'), createTrip);

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip data
 *   put:
 *     summary: Update a trip (e.g., change status)
 *     tags: [Trips]
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
 *                 enum: [scheduled, in-progress, completed, cancelled, delayed]
 *               actualStart:
 *                 type: string
 *                 format: date-time
 *               actualEnd:
 *                 type: string
 *                 format: date-time
 *               distance:
 *                 type: number
 *               fuelUsed:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
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
    .get(protect, getTrip)
    .put(protect, authorize('admin', 'manager', 'superadmin'), updateTrip)
    .delete(protect, authorize('admin', 'superadmin'), deleteTrip);

module.exports = router;
