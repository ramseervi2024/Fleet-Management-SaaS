const express = require('express');
const router = express.Router();
const { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle, updateGPS } = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management
 */

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles (tenant-scoped)
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, idle, maintenance, retired]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [truck, van, car, bus, motorcycle, suv, pickup, other]
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
 *         description: Vehicle list with pagination
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [registrationNumber, make, model, year, type]
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: "MH-12-AB-1234"
 *               make:
 *                 type: string
 *                 example: "Toyota"
 *               model:
 *                 type: string
 *                 example: "Hilux"
 *               year:
 *                 type: integer
 *                 example: 2022
 *               type:
 *                 type: string
 *                 enum: [truck, van, car, bus, motorcycle, suv, pickup, other]
 *                 example: "truck"
 *               fuelType:
 *                 type: string
 *                 enum: [petrol, diesel, electric, hybrid, cng, lpg]
 *                 example: "diesel"
 *               color:
 *                 type: string
 *                 example: "White"
 *               odometer:
 *                 type: number
 *                 example: 15000
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 */
router.route('/').get(protect, getVehicles).post(protect, authorize('admin', 'manager', 'superadmin'), createVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle data
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
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
 *                 enum: [active, idle, maintenance, retired]
 *               odometer:
 *                 type: number
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete (deactivate) a vehicle
 *     tags: [Vehicles]
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
    .get(protect, getVehicle)
    .put(protect, authorize('admin', 'manager', 'superadmin'), updateVehicle)
    .delete(protect, authorize('admin', 'superadmin'), deleteVehicle);

/**
 * @swagger
 * /api/vehicles/{id}/gps:
 *   patch:
 *     summary: Update vehicle GPS coordinates
 *     tags: [Vehicles]
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
 *               lat:
 *                 type: number
 *                 example: 19.076
 *               lng:
 *                 type: number
 *                 example: 72.877
 *               speed:
 *                 type: number
 *                 example: 60
 *     responses:
 *       200:
 *         description: GPS updated
 */
router.patch('/:id/gps', protect, updateGPS);

module.exports = router;
