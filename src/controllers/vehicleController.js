const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles (tenant-scoped)
// @route   GET /api/vehicles
// @access  Private
const getVehicles = async (req, res) => {
    try {
        const { status, type, page = 1, limit = 20, search } = req.query;
        const filter = { tenantId: req.tenantId, isActive: true };

        if (status) filter.status = status;
        if (type) filter.type = type;
        if (search) {
            filter.$or = [
                { registrationNumber: { $regex: search, $options: 'i' } },
                { make: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [vehicles, total] = await Promise.all([
            Vehicle.find(filter)
                .populate('assignedDriver', 'name phone licenseNumber')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Vehicle.countDocuments(filter),
        ]);

        res.json({
            success: true,
            count: vehicles.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            vehicles,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
const getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, tenantId: req.tenantId }).populate(
            'assignedDriver',
            'name phone licenseNumber'
        );
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
        res.json({ success: true, vehicle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create vehicle
// @route   POST /api/vehicles
// @access  Private (admin, manager)
const createVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.create({ ...req.body, tenantId: req.tenantId });
        res.status(201).json({ success: true, message: 'Vehicle created successfully.', vehicle });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'A vehicle with this registration number already exists in your fleet.'
            });
        }

        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (admin, manager)
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
        res.json({ success: true, message: 'Vehicle updated successfully.', vehicle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete vehicle (soft delete)
// @route   DELETE /api/vehicles/:id
// @access  Private (admin)
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            { isActive: false },
            { new: true }
        );
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
        res.json({ success: true, message: 'Vehicle deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update vehicle GPS
// @route   PATCH /api/vehicles/:id/gps
// @access  Private
const updateGPS = async (req, res) => {
    try {
        const { lat, lng, speed } = req.body;
        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            { gps: { lat, lng, speed, lastUpdated: new Date() } },
            { new: true }
        );
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
        res.json({ success: true, message: 'GPS updated.', gps: vehicle.gps });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle, updateGPS };
