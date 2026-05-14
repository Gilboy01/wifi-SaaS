// models/hotspot.model.js

const mongoose = require("mongoose");

const hotspotSchema = new mongoose.Schema({

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  hotspotCode: {
    type: String,
    unique: true
  },

  routerHost: String,

  routerUser: String,

  routerPassword: String,

  routerPort: {
    type: Number,
    default: 8728
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Hotspot", hotspotSchema);