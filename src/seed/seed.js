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

        // Clear existing demo data for a fresh start
        console.log('Clearing old demo data...');
        await Promise.all([
            Vehicle.deleteMany({}),
            Driver.deleteMany({}),
            Trip.deleteMany({}),
        ]);
        console.log('Old demo data cleared.');
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

        // 3. Create Vehicles
        const vehiclesData = [
            { registrationNumber: 'MH-01-AX-4422', make: 'Tata', model: 'Prima 5530.S', year: 2023, type: 'truck', gps: { lat: 19.0760, lng: 72.8777, speed: 65 } },
            { registrationNumber: 'DL-1G-BT-8899', make: 'Mahindra', model: 'Blazo X 49', year: 2024, type: 'truck', gps: { lat: 28.6139, lng: 77.2090, speed: 0 } },
            { registrationNumber: 'KA-03-MK-1122', make: 'Ashok Leyland', model: 'AVTR 4825', year: 2022, type: 'truck', gps: { lat: 12.9716, lng: 77.5946, speed: 45 } },
            { registrationNumber: 'TN-07-RT-3344', make: 'TVS', model: 'King Cargo', year: 2023, type: 'van', gps: { lat: 13.0827, lng: 80.2707, speed: 30 } }
        ];

        const createdVehicles = [];
        for (const v of vehiclesData) {
            let vehicle = await Vehicle.findOne({ registrationNumber: v.registrationNumber, tenantId: tenant._id });
            if (!vehicle) {
                vehicle = await Vehicle.create({ ...v, tenantId: tenant._id, status: 'active' });
                console.log('Vehicle created:', vehicle.registrationNumber);
            }
            createdVehicles.push(vehicle);
        }

        // 4. Create Drivers
        const driversData = [
            { name: 'Ramesh Seervi', phone: '+91 9822113344', licenseNumber: 'MH-12-20150012345', licenseType: 'C' },
            { name: 'Gaurav Sharma', phone: '+91 9122334455', licenseNumber: 'DL-04-20182233445', licenseType: 'C' },
            { name: 'Manjunath Swamy', phone: '+91 8877665544', licenseNumber: 'KA-05-20205566778', licenseType: 'C' }
        ];

        const createdDrivers = [];
        for (const d of driversData) {
            let driver = await Driver.findOne({ licenseNumber: d.licenseNumber, tenantId: tenant._id });
            if (!driver) {
                driver = await Driver.create({ ...d, tenantId: tenant._id, status: 'available', licenseExpiry: new Date('2030-12-31') });
                console.log('Driver created:', driver.name);
            }
            createdDrivers.push(driver);
        }

        // 5. Create In-Progress Trips
        const existingTrip1 = await Trip.findOne({ tenantId: tenant._id, tripNumber: 'TRP-IND-001' });
        if (!existingTrip1) {
            const trip = await Trip.create({
                tenantId: tenant._id,
                tripNumber: 'TRP-IND-001',
                vehicle: createdVehicles[0]._id,
                driver: createdDrivers[0]._id,
                origin: { address: 'Nhava Sheva Port, Mumbai', lat: 18.9438, lng: 72.9437 },
                destination: { address: 'Pune Chakan MIDC, Maharashtra', lat: 18.7511, lng: 73.8567 },
                currentLocation: { address: 'Mumbai-Pune Expressway', lat: 18.8500, lng: 73.4000 },
                scheduledStart: new Date(),
                status: 'in-progress',
                distance: 148,
                createdBy: admin._id
            });
            console.log('Trip 1 created:', trip.tripNumber);
        }

        const existingTrip2 = await Trip.findOne({ tenantId: tenant._id, tripNumber: 'TRP-IND-002' });
        if (!existingTrip2) {
            const trip = await Trip.create({
                tenantId: tenant._id,
                tripNumber: 'TRP-IND-002',
                vehicle: createdVehicles[1]._id,
                driver: createdDrivers[1]._id,
                origin: { address: 'Sanjay Gandhi Transport Nagar, Delhi', lat: 28.7495, lng: 77.1352 },
                destination: { address: 'Peenya Industrial Area, Bangalore', lat: 13.0285, lng: 77.5197 },
                currentLocation: { address: 'NH44 - Nagpur Crossing', lat: 21.1458, lng: 79.0882 },
                scheduledStart: new Date(),
                status: 'in-progress',
                distance: 2150,
                createdBy: admin._id
            });
            console.log('Trip 2 created:', trip.tripNumber);
        }

        const existingTrip3 = await Trip.findOne({ tenantId: tenant._id, tripNumber: 'TRP-IND-003' });
        if (!existingTrip3) {
            const trip = await Trip.create({
                tenantId: tenant._id,
                tripNumber: 'TRP-IND-003',
                vehicle: createdVehicles[2]._id,
                driver: createdDrivers[2]._id,
                origin: { address: 'Whitefield Hub, Bangalore', lat: 12.9698, lng: 77.7500 },
                destination: { address: 'Sriperumbudur Industrial Hub, Chennai', lat: 12.9634, lng: 79.9506 },
                currentLocation: { address: 'Kolar National Highway', lat: 13.1367, lng: 78.1292 },
                scheduledStart: new Date(),
                status: 'in-progress',
                distance: 330,
                createdBy: admin._id
            });
            console.log('Trip 3 created:', trip.tripNumber);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
