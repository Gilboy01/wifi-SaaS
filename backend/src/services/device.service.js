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
    device = await Device.findOneAndUpdate(
        { 
          tenantId,
          hotspotId,
          macAddress
        },
        {
         lastSeen: new Date(),
         status: "online",
          isBlocked: false,
          $inc: { totalConnections: 1 }
        },
        { returnDocument: "after" }
      );


      return device;

    }

    // new device
    device = await Device.create({
        tenantId,
        hotspotId,
        macAddress,
        status: "online",
        totalConnections: 1
      });

    return device;

  } catch (error) {

    // console.log( "Register device error", error);
  console.error("Register device error", {
      tenantId,
      hotspotId,
      error: error.message
   });

  }

};