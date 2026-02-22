const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
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
        type: {
            type: String,
            enum: ['routine', 'repair', 'inspection', 'tire', 'oil-change', 'brake', 'engine', 'electrical', 'other'],
            required: true,
        },
        title: { type: String, required: true, trim: true },
        description: { type: String },
        status: {
            type: String,
            enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
            default: 'scheduled',
        },
        scheduledDate: { type: Date, required: true },
        completedDate: { type: Date },
        odometerAtService: { type: Number },
        nextServiceOdometer: { type: Number },
        cost: { type: Number, default: 0 },
        vendor: {
            name: String,
            phone: String,
            address: String,
        },
        partsReplaced: [
            {
                name: String,
                quantity: Number,
                cost: Number,
            },
        ],
        notes: { type: String },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

maintenanceSchema.index({ tenantId: 1, vehicle: 1 });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
