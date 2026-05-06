// models/Device.js
const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  macAddress: {
    type: String,
    required: true,
    unique: true
  },

  ipAddress: String,

  hotspotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotspot"
  },

  lastSeen: Date,

},{timestamps: true});

module.exports = mongoose.model("Device", deviceSchema);