// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },

  deviceId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Device"
},

  phoneNumber: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "UGX"
  },

  provider: {
    type: String,
    enum: ["MTN", "AIRTEL"],
    required: true
  },

  transactionId: String,

  externalId: String, // from payment API

  status: {
    type: String,
    enum: ["inactive", "pending", "success", "failed"],
    default: "inactive"
  },

  macAddress: String,

  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package"
  },

  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session"
  },


},{timestamps: true});

module.exports = mongoose.model("Payment", paymentSchema);