const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    location: {
      type: String,
      required: true,
    },

    lat: {
      type: Number,
      required: true,
    },

    lng: {
      type: Number,
      required: true,
    },

    wasteAmount: {
      type: Number,
      required: true,
    },

    wasteTypes: {
  type: [String],
  required: true,
  default: [],
},

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);