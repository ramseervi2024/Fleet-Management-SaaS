const Driver = require('../models/Driver');

const getDrivers = async (req, res) => {
    try {
        const { status, page = 1, limit = 20, search } = req.query;
        const filter = { tenantId: req.tenantId, isActive: true };
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { licenseNumber: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [drivers, total] = await Promise.all([
            Driver.find(filter)
                .populate('assignedVehicle', 'registrationNumber make model')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Driver.countDocuments(filter),
        ]);
        res.json({ success: true, count: drivers.length, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), drivers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDriver = async (req, res) => {
    try {
        const driver = await Driver.findOne({ _id: req.params.id, tenantId: req.tenantId }).populate('assignedVehicle', 'registrationNumber make model');
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found.' });
        res.json({ success: true, driver });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createDriver = async (req, res) => {
    try {
        const driver = await Driver.create({ ...req.body, tenantId: req.tenantId });
        res.status(201).json({ success: true, message: 'Driver created successfully.', driver });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ success: false, message: 'License number already exists.' });
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found.' });
        res.json({ success: true, message: 'Driver updated successfully.', driver });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            { isActive: false },
            { new: true }
        );
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found.' });
        res.json({ success: true, message: 'Driver deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDrivers, getDriver, createDriver, updateDriver, deleteDriver };
