// models/device.model.js

const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({

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

  macAddress: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    validate: {
    validator: function(v) {
      return /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/.test(v);
    },
    message: props => `${props.value} is not a valid MAC address format`
  }

  },

  deviceName: {
    type: String
  },

  lastSeen: {

    type: Date,

    default: Date.now

  },

  isBlocked: {

    type: Boolean,

    default: false

  },

  totalConnections: {

    type: Number,

    default: 0

  }

}, {
  timestamps: true
});


// prevent duplicates
deviceSchema.index({

  hotspotId: 1,

  macAddress: 1

}, {
  unique: true
});

module.exports = mongoose.model("Device", deviceSchema );