const Device = require("../models/device.model");

exports.registerDevice =  async ({
    tenantId,
    hotspotId,
    macAddress }) => {
    
  try {
    // normalize MAC
    macAddress = macAddress.toUpperCase();

    if (!tenantId || !hotspotId || !macAddress) {
      throw new Error("tenantId, hotspotId, and macAddress are required");
   }
   

    let device = await Device.findOne({
        tenantId,
        hotspotId,
        macAddress
      });

    // existing device
    if (device) {
    //   device.lastSeen = new Date();
    //   device.totalConnections += 1;

    //   await device.save();
    device = await Device.findOneAndUpdate(
        { 
          tenantId,
          hotspotId,
          macAddress
        },
        {
         lastSeen: new Date(),
          $inc: { totalConnections: 1 }
        },
        { new: true }
      );


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

    // console.log( "Register device error", error);
    logger.error("Register device error", {
      tenantId,
      hotspotId,
      error: error.message
   });

  }

};