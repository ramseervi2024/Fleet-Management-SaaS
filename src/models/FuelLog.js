const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true,
        },
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true,
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
            default: null,
        },
        date: { type: Date, required: true, default: Date.now },
        fuelType: {
            type: String,
            enum: ['petrol', 'diesel', 'electric', 'cng', 'lpg'],
            required: true,
        },
        quantity: { type: Number, required: true, min: 0 },
        unit: { type: String, enum: ['liters', 'gallons', 'kwh'], default: 'liters' },
        pricePerUnit: { type: Number, required: true, min: 0 },
        totalCost: { type: Number },
        odometer: { type: Number, required: true },
        station: {
            name: String,
            location: String,
        },
        fullTank: { type: Boolean, default: true },
        notes: { type: String },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

fuelLogSchema.index({ tenantId: 1, vehicle: 1 });
fuelLogSchema.index({ tenantId: 1, date: -1 });

// Auto-calculate total cost
fuelLogSchema.pre('save', function (next) {
    if (this.quantity && this.pricePerUnit) {
        this.totalCost = parseFloat((this.quantity * this.pricePerUnit).toFixed(2));
    }
    next();
});

module.exports = mongoose.model('FuelLog', fuelLogSchema);
