require('dotenv').config();
const User = require('./models/User');
const Bin = require('./models/Bin');
const Truck = require('./models/Truck');
const Request = require('./models/Request');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🗑️ Clearing existing data...');
    await User.deleteMany();
    await Bin.deleteMany();
    await Truck.deleteMany();
    await Request.deleteMany();

    // ==================================================
    // USERS
    // ==================================================
    console.log('🌱 Seeding Users...');

    await User.create([
      {
        name: 'Admin User',
        email: 'admin@eco.com',
        password: 'password123',
        role: 'admin',
        rewardPoints: 0
      },

      {
        name: 'Demo User',
        email: 'user@eco.com',
        password: 'password123',
        role: 'user',
        rewardPoints: 250
      },

      {
        name: 'Ravi',
        email: 'ravi@eco.com',
        password: 'password123',
        role: 'user',
        rewardPoints: 1650
      },

      {
        name: 'Priya',
        email: 'priya@eco.com',
        password: 'password123',
        role: 'user',
        rewardPoints: 1420
      },

      {
        name: 'Kiran',
        email: 'kiran@eco.com',
        password: 'password123',
        role: 'user',
        rewardPoints: 1180
      },

      {
        name: 'Sneha',
        email: 'sneha@eco.com',
        password: 'password123',
        role: 'user',
        rewardPoints: 620
      },

      {
        name: 'Rahul',
        email: 'rahul@eco.com',
        password: 'password123',
        role: 'user',
        rewardPoints: 540
      },

      {
        name: 'Neha',
        email: 'neha@eco.com',
        password: 'password123',
        role: 'user',
        rewardPoints: 460
      },

      {
        name: 'Arjun',
        email: 'arjun@eco.com',
        password: 'password123',
        role: 'user',
        rewardPoints: 390
      },

      {
        name: 'Kavya',
        email: 'kavya@eco.com',
        password: 'password123',
        role: 'user',
        rewardPoints: 310
      },

      {
        name: 'Manoj',
        email: 'manoj@eco.com',
        password: 'password123',
        role: 'user',
        rewardPoints: 280
      },

      {
        name: 'Pooja',
        email: 'pooja@eco.com',
        password: 'password123',
        role: 'user',
        rewardPoints: 350
      }
    ]);

    // ==================================================
    // SMART BINS
    // ==================================================
    console.log('🌱 Seeding Bins...');

    await Bin.create([
      {
        binId: 'BIN-101',
        location: 'MG Road Metro',
        fillLevel: 92,
        lat: 12.9756,
        lng: 77.6050,
        status: 'OVERFLOW'
      },
      {
        binId: 'BIN-102',
        location: 'Brigade Road Junction',
        fillLevel: 68,
        lat: 12.9719,
        lng: 77.6088,
        status: 'MEDIUM'
      },
      {
        binId: 'BIN-103',
        location: 'Church Street Entry',
        fillLevel: 81,
        lat: 12.9735,
        lng: 77.6070,
        status: 'HIGH'
      },
      {
        binId: 'BIN-104',
        location: 'Commercial Street Side',
        fillLevel: 35,
        lat: 12.9782,
        lng: 77.6101,
        status: 'LOW'
      }
    ]);

    // ==================================================
    // TRUCKS (ONLY 2)
    // ==================================================
    console.log('🌱 Seeding Trucks...');

    await Truck.create([
      {
        truckId: 'TRK-01',
        capacity: 100,
        currentLoad: 72,
        lat: 12.9700,
        lng: 77.6000,
        route: 'MG Road North Route',
        status: 'Available'
      },
      {
        truckId: 'TRK-02',
        capacity: 100,
        currentLoad: 48,
        lat: 12.9705,
        lng: 77.6005,
        route: 'MG Road South Route',
        status: 'Available'
      }
    ]);

    // ==================================================
    // REQUESTS
    // ==================================================
    console.log('🌱 Seeding Requests...');

    await Request.create([
      {
        name: 'Ravi',
        phone: '9876543210',
        location: 'Near MG Road Metro',
        lat: 12.9740,
        lng: 77.6062,
        wasteAmount: 15,
        wasteType: 'Organic',
        priority: 'High',
        status: 'pending'
      },
      {
        name: 'Priya',
        phone: '9876543211',
        location: 'Brigade Road Top',
        lat: 12.9724,
        lng: 77.6094,
        wasteAmount: 10,
        wasteType: 'Recyclable',
        priority: 'Medium',
        status: 'pending'
      },
      {
        name: 'Kiran',
        phone: '9876543212',
        location: 'Church Street Corner',
        lat: 12.9731,
        lng: 77.6078,
        wasteAmount: 5,
        wasteType: 'E-Waste',
        priority: 'Low',
        status: 'pending'
      },
      {
        name: 'Sneha',
        phone: '9876543213',
        location: 'Near Trinity Circle',
        lat: 12.9762,
        lng: 77.6120,
        wasteAmount: 18,
        wasteType: 'Mixed',
        priority: 'High',
        status: 'pending'
      },
      {
        name: 'Rahul',
        phone: '9876543214',
        location: 'Museum Road',
        lat: 12.9712,
        lng: 77.6055,
        wasteAmount: 12,
        wasteType: 'Organic',
        priority: 'Medium',
        status: 'pending'
      },
      {
        name: 'Neha',
        phone: '9876543215',
        location: 'Residency Road',
        lat: 12.9698,
        lng: 77.6080,
        wasteAmount: 8,
        wasteType: 'Hazardous',
        priority: 'High',
        status: 'pending'
      },
      {
        name: 'Arjun',
        phone: '9876543216',
        location: 'Near Garuda Mall',
        lat: 12.9707,
        lng: 77.6102,
        wasteAmount: 14,
        wasteType: 'Mixed',
        priority: 'Medium',
        status: 'pending'
      },
      {
        name: 'Kavya',
        phone: '9876543217',
        location: 'Ulsoor Side Road',
        lat: 12.9780,
        lng: 77.6150,
        wasteAmount: 6,
        wasteType: 'E-Waste',
        priority: 'Low',
        status: 'pending'
      }
    ]);

    console.log('✅ Database seeded successfully!');
    process.exit();

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();