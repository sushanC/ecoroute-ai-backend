const Request = require('../models/Request');
const Bin = require('../models/Bin');
const Truck = require('../models/Truck');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalRequests = await Request.countDocuments();

    const pendingRequests = await Request.countDocuments({
      status: 'pending'
    });

    const overflowBins = await Bin.countDocuments({
      status: { $in: ['OVERFLOW', 'HIGH'] }
    });

    const activeTrucks = await Truck.countDocuments();

    // =================================================
    // Waste Collected
    // =================================================
    const completedRequests = await Request.find({
      status: 'completed'
    });

    let totalWasteKg = 0;

    completedRequests.forEach((item) => {
      if (item.wasteAmount) {
        totalWasteKg += item.wasteAmount;
      }
    });

    const wasteCollectedTons =
      (totalWasteKg / 1000).toFixed(2) + 't';

    // =================================================
    // Fuel Saved Calculation
    // =================================================
    // Demo logic:
    // Assume each request manually costs 2.5 km
    // Optimized routing saves 14%

    const avgKmPerRequest = 2.5;
    const normalDistance =
      totalRequests * avgKmPerRequest;

    const optimizedDistance =
      normalDistance * 0.86; // 14% less distance

    const mileage = 4; // 4 km per liter

    const normalFuel =
      normalDistance / mileage;

    const optimizedFuel =
      optimizedDistance / mileage;

    const fuelSaved =
      (
        ((normalFuel - optimizedFuel) /
          normalFuel) *
        100
      ).toFixed(0) + '%';

    // =================================================
    // Response
    // =================================================
    res.status(200).json({
      totalRequests,
      pendingRequests,
      overflowBins,
      activeTrucks,
      wasteCollected: wasteCollectedTons,
      fuelSaved
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};