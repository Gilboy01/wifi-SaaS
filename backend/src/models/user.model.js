// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },

  name: {
    type: String
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    trim:true
  },

  role: {
    type: String,
    enum: ["admin", "staff"],
    default: "admin"
  },

},{timestamps: true});

module.exports = mongoose.model("User", userSchema);