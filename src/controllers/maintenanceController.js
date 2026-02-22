const MaintenanceLog = require('../models/MaintenanceLog');
const Vehicle = require('../models/Vehicle');

const getMaintenance = async (req, res) => {
    try {
        const { status, vehicleId, page = 1, limit = 20 } = req.query;
        const filter = { tenantId: req.tenantId };
        if (status) filter.status = status;
        if (vehicleId) filter.vehicle = vehicleId;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [logs, total] = await Promise.all([
            MaintenanceLog.find(filter)
                .populate('vehicle', 'registrationNumber make model')
                .populate('createdBy', 'name')
                .sort({ scheduledDate: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            MaintenanceLog.countDocuments(filter),
        ]);
        res.json({ success: true, count: logs.length, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMaintenanceById = async (req, res) => {
    try {
        const log = await MaintenanceLog.findOne({ _id: req.params.id, tenantId: req.tenantId }).populate('vehicle', 'registrationNumber make model');
        if (!log) return res.status(404).json({ success: false, message: 'Maintenance log not found.' });
        res.json({ success: true, log });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createMaintenance = async (req, res) => {
    try {
        const log = await MaintenanceLog.create({ ...req.body, tenantId: req.tenantId, createdBy: req.user._id });
        if (req.body.status === 'in-progress') {
            await Vehicle.findByIdAndUpdate(req.body.vehicle, { status: 'maintenance' });
        }
        res.status(201).json({ success: true, message: 'Maintenance log created.', log });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateMaintenance = async (req, res) => {
    try {
        const log = await MaintenanceLog.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!log) return res.status(404).json({ success: false, message: 'Maintenance log not found.' });
        if (req.body.status === 'completed') {
            await Vehicle.findByIdAndUpdate(log.vehicle, { status: 'idle', lastService: new Date() });
        }
        res.json({ success: true, message: 'Maintenance log updated.', log });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteMaintenance = async (req, res) => {
    try {
        const log = await MaintenanceLog.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
        if (!log) return res.status(404).json({ success: false, message: 'Maintenance log not found.' });
        res.json({ success: true, message: 'Maintenance log deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getMaintenance, getMaintenanceById, createMaintenance, updateMaintenance, deleteMaintenance };
