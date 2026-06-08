// controllers/voucher.controller.js

const Voucher = require("../models/voucher.model");
const Package = require("../models/package.model");
const Session = require("../models/session.model");

const {registerDevice} = require("../services/device.service");

const { grantInternetAccess} = require("../services/router.service");

// redeem voucher
exports.redeemVoucher = async ( req,  res) => {

  try {

    const {
      code,
      macAddress
    } = req.body;

    // Validate code n macAddress 
    if (!code || !macAddress) {

      return res.status(400).json({
        success: false,
        message:"Voucher code and MAC address required"
      });

    }

    const normalizedMac = macAddress.toUpperCase().trim();

    // find voucher
    const voucher = await Voucher.findOne({code});

    if (!voucher) {

      return res.status(404).json({
        success: false,
        message: "Invalid voucher"
      });

    }

    // already used?
    if (voucher.isUsed) {

      return res.status(400).json({
        success: false,
        message:"Voucher already used"
      });

    }

    // package
    const pkg = await Package.findById(
        voucher.packageId
      );

    if (!pkg) {

      return res.status(404).json({
        success: false,
        message: "Package not found"
      });

    }

    // active session?
    const existingSession =
      await Session.findOne({
        macAddress: normalizedMac,
        status: "active",
        expiryTime: {
          $gt: new Date()
        }
      });

    if (existingSession) {

      return res.status(400).json({
        success: false,
        message: "Device already has active internet"
      });

    }

    // register device
    const device =  await registerDevice({
        tenantId: voucher.tenantId,
        hotspotId: voucher.hotspotId,
        macAddress: normalizedMac
      });

    // grant internet
    await grantInternetAccess({
      hotspotId: voucher.hotspotId,
      macAddress: normalizedMac
    });

    // create session
    const session = await Session.create({
        tenantId: voucher.tenantId,
        hotspotId: voucher.hotspotId,
        deviceId: device._id,
        packageId: voucher.packageId,
        macAddress: normalizedMac,
        startTime: new Date(),
        expiryTime:new Date(Date.now() + pkg.duration * 60 * 1000),
        status: "active"
      });

    // mark voucher used
    voucher.isUsed = true;
    voucher.usedByMac = normalizedMac;
    voucher.usedAt = new Date();

    await voucher.save();

    return res.status(200).json({
      success: true,
      session
    });

  } catch (error) {

    console.error("Voucher redeem error", error);

    res.status(500).json({
      success: false,
      message: "Error redeeming voucher"
    });

  }

};