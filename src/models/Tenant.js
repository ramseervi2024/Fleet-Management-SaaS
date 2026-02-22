const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Organization name is required'],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Organization email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: { type: String, trim: true },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            zipCode: String,
        },
        logo: { type: String },
        plan: {
            type: String,
            enum: ['free', 'starter', 'professional', 'enterprise'],
            default: 'free',
        },
        isActive: { type: Boolean, default: true },
        settings: {
            maxVehicles: { type: Number, default: 10 },
            maxDrivers: { type: Number, default: 20 },
            maxUsers: { type: Number, default: 5 },
            fuelUnit: { type: String, enum: ['liters', 'gallons'], default: 'liters' },
            distanceUnit: { type: String, enum: ['km', 'miles'], default: 'km' },
            currency: { type: String, default: 'USD' },
        },
    },
    { timestamps: true }
);

// Auto-generate slug from name
tenantSchema.pre('validate', function (next) {
    if (this.isNew && this.name && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') +
            '-' +
            Date.now().toString(36);
    }
    next();
});

module.exports = mongoose.model('Tenant', tenantSchema);
