const Device = require("../models/device.model");
const {
  revokeInternetAccess
} = require("../services/router.service");

//   fetch devices
exports.getDevices = async (req, res) => {

    try {

      const devices = await Device.find({
          tenantId: req.user.tenantId
        })
        .populate(
          "hotspotId",
          "name"
        )
        .sort({
          lastSeen: -1
        });

      res.status(200).json({
        success: true,
        devices
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to fetch devices"
      });

    }
};


// disconnect devices
exports.disconnectDevice = async (req, res) => {

    try {
      const device = await Device.findById(req.params.id);

      if (!device) {
        return res.status(404).json({
          success: false,
          message: "Device not found"
        });
      }

      await revokeInternetAccess({
        hotspotId: device.hotspotId,
        macAddress: device.macAddress
      });

      device.status = "offline";

      await device.save();

      res.json({
        success: true,
        message: "Device disconnected"
      });

    } catch (error) {
        console.log(error);
      res.status(500).json({
        success: false,
        message: "Disconnect failed"
      });

    }
};