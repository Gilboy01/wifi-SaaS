// models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },

  hotspotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotspot",
    required: true
  },

  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device"
  },

  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package"
  },

  macAddress: {
    type: String,
    required: true
  },

   phoneNumber: String,



  startTime: {
    type: Date,
    default: Date.now
  },

  expiryTime: {
    type: Date,
  },

  status: {
    type: String,
    enum: ["active", "expired", "terminated"],
    default: "active"
  }
});

module.exports = mongoose.model("Session", sessionSchema);