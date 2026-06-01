const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    points: {
      type: Number,
      required: [true, 'Please add points'],
    },
    benefitType: {
      type: String,
      required: [true, 'Please add a benefit type'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reward', rewardSchema);
