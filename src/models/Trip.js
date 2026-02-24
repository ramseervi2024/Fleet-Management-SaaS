const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true,
        },
        tripNumber: { type: String, required: true },
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true,
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
            required: true,
        },
        origin: {
            address: { type: String, required: true },
            lat: Number,
            lng: Number,
        },
        destination: {
            address: { type: String, required: true },
            lat: Number,
            lng: Number,
        },
        currentLocation: {
            address: String,
            lat: Number,
            lng: Number,
        },
        scheduledStart: { type: Date, required: true },

        scheduledEnd: { type: Date },
        actualStart: { type: Date },
        actualEnd: { type: Date },
        status: {
            type: String,
            enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'delayed'],
            default: 'scheduled',
        },
        distance: { type: Number, default: 0 },
        fuelUsed: { type: Number, default: 0 },
        cost: { type: Number, default: 0 },
        cargo: {
            description: String,
            weight: Number,
            unit: { type: String, enum: ['kg', 'tons', 'lbs'], default: 'kg' },
        },
        stops: [
            {
                address: String,
                lat: Number,
                lng: Number,
                scheduledTime: Date,
                arrivedTime: Date,
                status: { type: String, enum: ['pending', 'arrived', 'skipped'], default: 'pending' },
            },
        ],
        notes: { type: String },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

tripSchema.index({ tenantId: 1, tripNumber: 1 }, { unique: true });
tripSchema.index({ tenantId: 1, status: 1 });

// Auto-generate trip number
tripSchema.pre('validate', async function (next) {
    if (this.isNew && !this.tripNumber) {
        const count = await this.constructor.countDocuments({ tenantId: this.tenantId });
        this.tripNumber = `TRP-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Trip', tripSchema);
