const mongoose = require('mongoose');

const binSchema = new mongoose.Schema(
  {
    binId: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    fillLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
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
    status: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'OVERFLOW'],
      default: 'LOW',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to update status based on fill level
binSchema.pre('save', function () {
  if (this.fillLevel >= 91) {
    this.status = 'OVERFLOW';
  } else if (this.fillLevel >= 71) {
    this.status = 'HIGH';
  } else if (this.fillLevel >= 41) {
    this.status = 'MEDIUM';
  } else {
    this.status = 'LOW';
  }
});

module.exports = mongoose.model('Bin', binSchema);
