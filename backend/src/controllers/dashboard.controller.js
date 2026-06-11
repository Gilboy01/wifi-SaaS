// controllers/dashboard.controller.js

const Hotspot = require("../models/hotspot.model");
const Session = require("../models/session.model");
const Payment = require("../models/payment.model");
const Package = require("../models/package.model");

exports.getDashboardStats = async (req, res) => {

  try {

    const tenantId = req.user.tenantId;

    const totalHotspots = await Hotspot.countDocuments({ tenantId });

    const activeSessions = await Session.countDocuments({
        tenantId,
        status: "active"
      });

    const totalPayments = await Payment.countDocuments({
        tenantId,
        status: "success"
      });

    const payments = await Payment.find({
        tenantId,
        status: "success"
      });

    const revenue = payments.reduce(
        (sum, payment) => sum + payment.amount, 0
      );

      const recentPayments = await Payment.find({
      tenantId
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const sessions = await Session.find({
      tenantId,
      status: "active"
    })
      .populate("packageId")
      .sort({ createdAt: -1 })
      .limit(5);

    const packages = await Package.find({
      tenantId
    });


    res.status(200).json({
      success: true,
      stats: {
        totalHotspots,
        activeSessions,
        totalPayments,
        revenue
      },
      recentPayments,
      sessions,
      packages
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error loading dashboard"
    });

  }
};