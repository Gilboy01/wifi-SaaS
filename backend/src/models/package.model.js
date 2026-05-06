// models/Package.js
const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },

  hotspotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotspot"
  },

  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  duration: {
    type: Number, // in minutes
    required: true
  },

//   dataLimitMB: {
//     type: Number, // optional
//     default: null
//   },

  isActive: {
    type: Boolean,
    default: true
  },

  
},{timestamps: true});

module.exports = mongoose.model("Package", packageSchema);