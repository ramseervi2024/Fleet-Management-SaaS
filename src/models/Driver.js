const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        name: {
            type: String,
            required: [true, 'Driver name is required'],
            trim: true,
        },
        email: { type: String, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
        licenseNumber: {
            type: String,
            required: [true, 'License number is required'],
            trim: true,
            uppercase: true,
        },
        licenseType: {
            type: String,
            enum: ['A', 'B', 'C', 'D', 'E'],
            required: true,
        },
        licenseExpiry: { type: Date, required: true },
        dateOfBirth: { type: Date },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
        },
        status: {
            type: String,
            enum: ['available', 'on-trip', 'off-duty', 'suspended'],
            default: 'available',
        },
        assignedVehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            default: null,
        },
        totalTrips: { type: Number, default: 0 },
        totalDistance: { type: Number, default: 0 },
        rating: { type: Number, default: 5, min: 1, max: 5 },
        emergencyContact: {
            name: String,
            phone: String,
            relation: String,
        },
        notes: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

driverSchema.index({ tenantId: 1, licenseNumber: 1 }, { unique: true });

module.exports = mongoose.model('Driver', driverSchema);
