const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const MaintenanceLog = require('../models/MaintenanceLog');
const FuelLog = require('../models/FuelLog');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const tenantId = req.tenantId;

        const [
            totalVehicles,
            activeVehicles,
            idleVehicles,
            maintenanceVehicles,
            totalDrivers,
            availableDrivers,
            onTripDrivers,
            totalTrips,
            activeTrips,
            completedTrips,
            scheduledMaintenance,
            recentTrips,
            recentFuelLogs,
        ] = await Promise.all([
            Vehicle.countDocuments({ tenantId, isActive: true }),
            Vehicle.countDocuments({ tenantId, status: 'active', isActive: true }),
            Vehicle.countDocuments({ tenantId, status: 'idle', isActive: true }),
            Vehicle.countDocuments({ tenantId, status: 'maintenance', isActive: true }),
            Driver.countDocuments({ tenantId, isActive: true }),
            Driver.countDocuments({ tenantId, status: 'available', isActive: true }),
            Driver.countDocuments({ tenantId, status: 'on-trip', isActive: true }),
            Trip.countDocuments({ tenantId }),
            Trip.countDocuments({ tenantId, status: 'in-progress' }),
            Trip.countDocuments({ tenantId, status: 'completed' }),
            MaintenanceLog.countDocuments({ tenantId, status: { $in: ['scheduled', 'in-progress'] } }),
            Trip.find({ tenantId })
                .populate('vehicle', 'registrationNumber make')
                .populate('driver', 'name')
                .sort({ createdAt: -1 })
                .limit(5),
            FuelLog.find({ tenantId })
                .populate('vehicle', 'registrationNumber make')
                .sort({ date: -1 })
                .limit(5),
        ]);

        // Monthly fuel cost aggregation (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyFuel = await FuelLog.aggregate([
            { $match: { tenantId, date: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: '$date' }, month: { $month: '$date' } },
                    totalCost: { $sum: '$totalCost' },
                    totalQuantity: { $sum: '$quantity' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        // Monthly trips aggregation
        const monthlyTrips = await Trip.aggregate([
            { $match: { tenantId, createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                    completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        res.json({
            success: true,
            stats: {
                vehicles: { total: totalVehicles, active: activeVehicles, idle: idleVehicles, maintenance: maintenanceVehicles },
                drivers: { total: totalDrivers, available: availableDrivers, onTrip: onTripDrivers },
                trips: { total: totalTrips, active: activeTrips, completed: completedTrips },
                maintenance: { pending: scheduledMaintenance },
            },
            charts: { monthlyFuel, monthlyTrips },
            recent: { trips: recentTrips, fuelLogs: recentFuelLogs },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get public cross-tenant statistics
// @route   GET /api/dashboard/public-stats
// @access  Public
const getPublicStats = async (req, res) => {
    try {
        const [
            totalTenants,
            totalVehicles,
            activeTrips,
        ] = await Promise.all([
            require('../models/Tenant').countDocuments({ isActive: true }),
            Vehicle.countDocuments({ isActive: true }),
            Trip.countDocuments({ status: 'in-progress' }),
        ]);

        res.json({
            success: true,
            stats: {
                tenants: totalTenants,
                vehicles: totalVehicles,
                activeTrips: activeTrips,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardStats, getPublicStats };
