const express = require('express');
const router = express.Router();
const { getDashboardStats, getPublicStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: KPI stats and analytics
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard KPI statistics and charts
 *     tags: [Dashboard]
 *     description: Returns vehicle stats, driver stats, trip stats, maintenance counts, monthly fuel costs, monthly trip trends, and recent activity (all tenant-scoped).
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     vehicles:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         active:
 *                           type: integer
 *                         idle:
 *                           type: integer
 *                         maintenance:
 *                           type: integer
 *                     drivers:
 *                       type: object
 *                     trips:
 *                       type: object
 *                     maintenance:
 *                       type: object
 *                 charts:
 *                   type: object
 *                 recent:
 *                   type: object
 *       401:
 *         description: Not authenticated
 */
router.get('/public-stats', getPublicStats);
router.get('/stats', protect, getDashboardStats);

module.exports = router;
