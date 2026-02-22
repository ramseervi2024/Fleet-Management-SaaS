const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true,
        },
        registrationNumber: {
            type: String,
            required: [true, 'Registration number is required'],
            trim: true,
            uppercase: true,
        },
        make: { type: String, required: true, trim: true },
        model: { type: String, required: true, trim: true },
        year: {
            type: Number,
            required: true,
            min: 1990,
            max: new Date().getFullYear() + 1,
        },
        type: {
            type: String,
            enum: ['truck', 'van', 'car', 'bus', 'motorcycle', 'suv', 'pickup', 'other'],
            required: true,
        },
        fuelType: {
            type: String,
            enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg'],
            default: 'diesel',
        },
        status: {
            type: String,
            enum: ['active', 'idle', 'maintenance', 'retired'],
            default: 'idle',
        },
        odometer: { type: Number, default: 0, min: 0 },
        capacity: { type: Number },
        color: { type: String },
        vin: { type: String, trim: true },
        assignedDriver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
            default: null,
        },
        insurance: {
            provider: String,
            policyNumber: String,
            expiryDate: Date,
        },
        lastService: { type: Date },
        nextServiceDue: { type: Date },
        gps: {
            lat: { type: Number },
            lng: { type: Number },
            lastUpdated: { type: Date },
            speed: { type: Number, default: 0 },
        },
        notes: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

vehicleSchema.index({ tenantId: 1, registrationNumber: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
