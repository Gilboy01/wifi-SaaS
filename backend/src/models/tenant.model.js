// models/Tenant.js
const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true
  },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   trim: true
  // },
  // password: {
  //   type: String,
  //   required: true,
  //   trim: true
  // },
  phoneNumber:{
    type: String
  },

  subscriptionStatus: {
    type: String,
    enum: ["active", "inactive", "trial"],
    default: "trial"
  },

  subscriptionExpiry: {
    type: Date
},

},{timestamps: true});

module.exports = mongoose.model("Tenant", tenantSchema);