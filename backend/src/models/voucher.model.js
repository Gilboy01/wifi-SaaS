// models/voucher.model.js

const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
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

  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment"
  },

  code: {
    type: String,
    unique: true
  },

  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package"
  },

  isUsed: {
    type: Boolean,
    default: false
  },

  usedAt: Date,

  usedByMac: String
},
{
  timestamps: true
});

module.exports = mongoose.model("Voucher",voucherSchema);