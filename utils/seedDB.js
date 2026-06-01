const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Bin = require('../models/Bin');
const Truck = require('../models/Truck');
const Request = require('../models/Request');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoroute_ai');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing old data...');
    await User.deleteMany();
    await Bin.deleteMany();
    await Truck.deleteMany();
    await Request.deleteMany();

    console.log('Seeding Users...');
    await User.insertMany([
      { name: 'Admin', email: 'admin@eco.com', password: 'password123', role: 'admin' },
      { name: 'Demo User', email: 'user@eco.com', password: 'password123', role: 'user', rewardPoints: 50 },
      { name: 'Demo Driver', email: 'driver@eco.com', password: 'password123', role: 'driver' },
    ]);

    console.log('Seeding Bins (MG Road)...');
    await Bin.insertMany([
      { binId: 'BIN-101', location: 'MG Road Metro', fillLevel: 92, lat: 12.9756, lng: 77.6050 },
      { binId: 'BIN-102', location: 'Brigade Road Junction', fillLevel: 68, lat: 12.9719, lng: 77.6088 },
      { binId: 'BIN-103', location: 'Church Street Entry', fillLevel: 81, lat: 12.9735, lng: 77.6070 },
      { binId: 'BIN-104', location: 'Commercial Street Side', fillLevel: 35, lat: 12.9782, lng: 77.6101 },
    ]);

    console.log('Seeding Requests (MG Road)...');
    await Request.insertMany([
      { name: 'Ravi', phone: '9876543210', location: 'Near MG Road Metro', wasteAmount: 15, wasteType: 'Organic', priority: 'Medium', status: 'pending', lat: 12.9740, lng: 77.6062 },
      { name: 'Priya', phone: '9876543211', location: 'Brigade Road', wasteAmount: 8, wasteType: 'E-Waste', priority: 'Medium', status: 'pending', lat: 12.9724, lng: 77.6094 },
      { name: 'Kiran', phone: '9876543212', location: 'Church Street', wasteAmount: 20, wasteType: 'Mixed', priority: 'High', status: 'pending', lat: 12.9731, lng: 77.6078 },
    ]);

    console.log('Seeding Trucks...');
    await Truck.insertMany([
      { truckId: 'TRK-01', capacity: 100, currentLoad: 0, lat: 12.9700, lng: 77.6000, status: 'Available', route: 'Depot -> BIN-101 -> BIN-103 -> Ravi' },
      { truckId: 'TRK-02', capacity: 100, currentLoad: 0, lat: 12.9705, lng: 77.6005, status: 'Available', route: 'Depot -> Priya -> Kiran -> BIN-102' },
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
