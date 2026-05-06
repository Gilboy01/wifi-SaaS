// models/Hotspot.js
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

  location: String,

  routerIP: String,

  routerUsername: String,
  routerPassword: String,

  routerType: {
    type: String,
    enum: ["mikrotik", "openwrt"],
    default: "mikrotik"
  },

  status: {
    type: String,
    enum: ["active", "offline"],
    default: "active"
  },


}, {timestamps: true});

module.exports = mongoose.model("Hotspot", hotspotSchema);