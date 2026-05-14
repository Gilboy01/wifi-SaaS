const Device = require("../models/device.model");

exports.registerDevice =  async ({
    tenantId,
    hotspotId,
    macAddress }) => {

  try {

    // normalize MAC
    macAddress = macAddress.toUpperCase();

    let device = await Device.findOne({
        hotspotId,
        macAddress
      });

    // existing device
    if (device) {
      device.lastSeen = new Date();
      device.totalConnections += 1;

      await device.save();

      return device;

    }

    // new device
    device = await Device.create({
        tenantId,
        hotspotId,
        macAddress,
        totalConnections: 1
      });

    return device;

  } catch (error) {

    console.log( "Register device error", error);

    throw error;

  }

};