const mongoose = require('mongoose');
const Session = require("../models/session.model");
const { revokeInternetAccess } = require("../services/router.service");

// all active sessions controller
exports.getActiveSessions = async (req, res) => {

  try {

    const sessions = await Session.find({
      tenantId:req.user.tenantId,
        status: "active",
        expiryTime: {
          $gt: new Date()
        }
      })
      .populate("packageId")
      .populate("deviceId")
      .populate("hotspotId");

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });

  } catch (error) {

    console.log("Get sessions error", error);

    res.status(500).json({
      success: false,
      message:"Error fetching sessions"
    });

  }

};

// disconnect session controller
exports.disconnectSession = async (req, res) => {

  try {

     // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({
            success: false,
            message: "Invalid session ID format"
          });
        }

    const session = await Session.findById(req.params.id);

   

    if (!session) {
      return res.status(404).json({
        success: false,
        message:"Session not found"
      });

    }

    // revoke router access
    await revokeInternetAccess({
      hotspotId: session.hotspotId,
      macAddress: session.macAddress
    });

    // mark expired
    session.status = "terminated";
    await session.save();

    res.status(200).json({
      success: true,
      message: "Session disconnected"
    });

  } catch (error) {

    console.log("Disconnect session error", error);

    res.status(500).json({
      success: false,
      message: "Error disconnecting session"
    });

  }

};

// get sessions by hotspot
exports.getHotspotSessions = async (req, res) => {

  try {
     // Validate ObjectId format
          if (!mongoose.Types.ObjectId.isValid(req.params.hotspotId)) {
            return res.status(400).json({
              success: false,
              message: "Invalid hotspot ID format"
            });
          }

    const sessions = await Session.find({
        tenantId: req.user.tenantId,
        hotspotId: req.params.hotspotId
      })
      .populate("deviceId")
      .populate("packageId");

     
        //   check if sessions exist
           if (sessions.length === 0) {
      return res.status(404).json({
        success: false,
        message:"No sessions found for this hotspot"
      });

    }

    res.status(200).json({
      success: true,
      sessions
    });

  } catch (error) {

    console.log("Hotspot sessions error", error);

    res.status(500).json({
      success: false,
      message: "Error fetching hotspot sessions"
    });

  }

};
