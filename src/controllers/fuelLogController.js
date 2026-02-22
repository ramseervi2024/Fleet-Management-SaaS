const FuelLog = require('../models/FuelLog');

const getFuelLogs = async (req, res) => {
    try {
        const { vehicleId, page = 1, limit = 20 } = req.query;
        const filter = { tenantId: req.tenantId };
        if (vehicleId) filter.vehicle = vehicleId;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [logs, total] = await Promise.all([
            FuelLog.find(filter)
                .populate('vehicle', 'registrationNumber make model')
                .populate('driver', 'name')
                .sort({ date: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            FuelLog.countDocuments(filter),
        ]);
        res.json({ success: true, count: logs.length, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getFuelLog = async (req, res) => {
    try {
        const log = await FuelLog.findOne({ _id: req.params.id, tenantId: req.tenantId })
            .populate('vehicle', 'registrationNumber make model')
            .populate('driver', 'name');
        if (!log) return res.status(404).json({ success: false, message: 'Fuel log not found.' });
        res.json({ success: true, log });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createFuelLog = async (req, res) => {
    try {
        const log = await FuelLog.create({ ...req.body, tenantId: req.tenantId, createdBy: req.user._id });
        res.status(201).json({ success: true, message: 'Fuel log created.', log });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateFuelLog = async (req, res) => {
    try {
        const log = await FuelLog.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!log) return res.status(404).json({ success: false, message: 'Fuel log not found.' });
        res.json({ success: true, message: 'Fuel log updated.', log });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteFuelLog = async (req, res) => {
    try {
        const log = await FuelLog.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
        if (!log) return res.status(404).json({ success: false, message: 'Fuel log not found.' });
        res.json({ success: true, message: 'Fuel log deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getFuelLogs, getFuelLog, createFuelLog, updateFuelLog, deleteFuelLog };
