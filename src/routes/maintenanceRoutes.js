const express = require('express');
const router = express.Router();
const { getMaintenance, getMaintenanceById, createMaintenance, updateMaintenance, deleteMaintenance } = require('../controllers/maintenanceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

/**
 * @swagger
 * tags:
 *   name: Maintenance
 *   description: Vehicle maintenance logs
 */

/**
 * @swagger
 * /api/maintenance:
 *   get:
 *     summary: Get all maintenance logs (tenant-scoped)
 *     tags: [Maintenance]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, in-progress, completed, cancelled]
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
 *         description: Maintenance log list
 *   post:
 *     summary: Create a maintenance log
 *     tags: [Maintenance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehicle, type, title, scheduledDate]
 *             properties:
 *               vehicle:
 *                 type: string
 *                 example: "65a1b2c3d4e5f6g7h8i9j0k1"
 *               type:
 *                 type: string
 *                 enum: [routine, repair, inspection, tire, oil-change, brake, engine, electrical, other]
 *                 example: "oil-change"
 *               title:
 *                 type: string
 *                 example: "Engine oil + filter change"
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-01"
 *               cost:
 *                 type: number
 *                 example: 1500
 *               vendor:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "ServicePro Garage"
 *     responses:
 *       201:
 *         description: Maintenance log created
 */
router.route('/').get(protect, getMaintenance).post(protect, authorize('admin', 'manager', 'superadmin'), createMaintenance);

/**
 * @swagger
 * /api/maintenance/{id}:
 *   get:
 *     summary: Get maintenance log by ID
 *     tags: [Maintenance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Maintenance log data
 *   put:
 *     summary: Update maintenance log
 *     tags: [Maintenance]
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
 *                 enum: [scheduled, in-progress, completed, cancelled]
 *               completedDate:
 *                 type: string
 *                 format: date
 *               cost:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete maintenance log
 *     tags: [Maintenance]
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
    .get(protect, getMaintenanceById)
    .put(protect, authorize('admin', 'manager', 'superadmin'), updateMaintenance)
    .delete(protect, authorize('admin', 'superadmin'), deleteMaintenance);

module.exports = router;
