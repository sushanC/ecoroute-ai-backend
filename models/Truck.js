const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema(
  {
    truckId: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    currentLoad: {
      type: Number,
      default: 0,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    route: {
      type: String,
      default: 'Unassigned',
    },
    status: {
      type: String,
      enum: ['Available', 'Busy'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Truck', truckSchema);
