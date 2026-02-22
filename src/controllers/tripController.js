const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

const getTrips = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const filter = { tenantId: req.tenantId };
        if (status) filter.status = status;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [trips, total] = await Promise.all([
            Trip.find(filter)
                .populate('vehicle', 'registrationNumber make model')
                .populate('driver', 'name phone')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Trip.countDocuments(filter),
        ]);
        res.json({ success: true, count: trips.length, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), trips });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({ _id: req.params.id, tenantId: req.tenantId })
            .populate('vehicle', 'registrationNumber make model type')
            .populate('driver', 'name phone licenseNumber')
            .populate('createdBy', 'name email');
        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
        res.json({ success: true, trip });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createTrip = async (req, res) => {
    try {
        const trip = await Trip.create({ ...req.body, tenantId: req.tenantId, createdBy: req.user._id });
        // Update vehicle and driver status
        await Vehicle.findByIdAndUpdate(req.body.vehicle, { status: 'active' });
        await Driver.findByIdAndUpdate(req.body.driver, { status: 'on-trip' });
        res.status(201).json({ success: true, message: 'Trip created successfully.', trip });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

        // If trip completed/cancelled, free up driver and vehicle
        if (req.body.status === 'completed' || req.body.status === 'cancelled') {
            await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'idle' });
            await Driver.findByIdAndUpdate(trip.driver, { status: 'available' });
            if (req.body.status === 'completed') {
                await Driver.findByIdAndUpdate(trip.driver, { $inc: { totalTrips: 1, totalDistance: trip.distance || 0 } });
            }
        }
        res.json({ success: true, message: 'Trip updated successfully.', trip });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
        res.json({ success: true, message: 'Trip deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getTrips, getTrip, createTrip, updateTrip, deleteTrip };
