const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Create Tenant
        let tenant = await Tenant.findOne({ slug: 'demo-fleet' });
        if (!tenant) {
            tenant = await Tenant.create({
                name: 'Demo Fleet Corp',
                slug: 'demo-fleet',
                email: 'demo@fleet.com',
                settings: { maxVehicles: 10, maxDrivers: 20, maxUsers: 5 }
            });
            console.log('Tenant created:', tenant.name);
        }

        // 2. Create Admin User
        let admin = await User.findOne({ email: 'admin@demo.com', tenantId: tenant._id });
        if (!admin) {
            admin = await User.create({
                name: 'Admin User',
                email: 'admin@demo.com',
                password: 'password123',
                role: 'admin',
                tenantId: tenant._id
            });
            console.log('Admin user created:', admin.email);
        }

        // 3. Create Vehicle
        let vehicle = await Vehicle.findOne({ registrationNumber: 'DEMO-001', tenantId: tenant._id });
        if (!vehicle) {
            vehicle = await Vehicle.create({
                tenantId: tenant._id,
                registrationNumber: 'DEMO-001',
                make: 'Tesla',
                model: 'Model Semi',
                year: 2024,
                type: 'truck',
                status: 'active',
                gps: { lat: 19.0760, lng: 72.8777, speed: 65 } // Mumbai
            });
            console.log('Vehicle created:', vehicle.registrationNumber);
        }

        // 4. Create Driver
        let driver = await Driver.findOne({ licenseNumber: 'DL-DEMO-001', tenantId: tenant._id });
        if (!driver) {
            driver = await Driver.create({
                tenantId: tenant._id,
                name: 'John Doe',
                phone: '+91 9876543210',
                licenseNumber: 'DL-DEMO-001',
                licenseType: 'C',
                licenseExpiry: new Date('2030-12-31'),
                status: 'on-trip'
            });
            console.log('Driver created:', driver.name);
        }

        // 5. Create In-Progress Trips
        const existingTrip1 = await Trip.findOne({ tenantId: tenant._id, tripNumber: 'TRP-00001' });
        if (!existingTrip1) {
            const trip = await Trip.create({
                tenantId: tenant._id,
                vehicle: vehicle._id,
                driver: driver._id,
                origin: { address: 'Mumbai Port, Maharashtra', lat: 18.9438, lng: 72.8387 },
                destination: { address: 'Pune Logistics Park, Maharashtra', lat: 18.5204, lng: 73.8567 },
                currentLocation: { address: 'En Route - Expressway', lat: 18.7500, lng: 73.3500 },
                scheduledStart: new Date(),
                status: 'in-progress',
                distance: 150,
                createdBy: admin._id
            });
            console.log('Trip 1 created:', trip.tripNumber);
        }

        const existingTrip2 = await Trip.findOne({ tenantId: tenant._id, tripNumber: 'TRP-00002' });
        if (!existingTrip2) {
            const trip = await Trip.create({
                tenantId: tenant._id,
                vehicle: vehicle._id, // Using same vehicle for demo, though in reality one vehicle per trip
                driver: driver._id,
                origin: { address: 'Delhi Hub, New Delhi', lat: 28.6139, lng: 77.2090 },
                destination: { address: 'Electronic City, Bangalore', lat: 12.9716, lng: 77.5946 },
                currentLocation: { address: 'Processing - NH44', lat: 21.1458, lng: 79.0882 }, // Nagpur (roughly halfway)
                scheduledStart: new Date(),
                status: 'in-progress',
                distance: 2100,
                createdBy: admin._id
            });
            console.log('Trip 2 created:', trip.tripNumber);
        }


        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
