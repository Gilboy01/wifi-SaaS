const Session = require("../models/session.model");
const Device = require("../models/device.model")

const { revokeInternetAccess } = require("../services/router.service");

exports.expireSessions = async () => {

  const expiredSessions =  await Session.find({

      status: "active",
      expiryTime: {
        $lt: new Date()
      }

    });


    for (const session of expiredSessions) {

    try {
      await revokeInternetAccess({
        hotspotId: session.hotspotId ,
       macAddress: session.macAddress.toUpperCase().trim()
      });

    session.status = "expired";
    await session.save();

    console.log( `Expired ${session.macAddress}, Internet blocked`);

    // update device
    const device = await Device.findOne(
        {
          hotspotId: session.hotspotId,
          macAddress: session.macAddress.toUpperCase().trim(),
        },
        // {
        //   status: "offline"
        // },
        // {
        //   new: true
        // }
      );

      device.status = "offline";
      await device.save();

   } catch (error) {
        console.error( `Failed to revoke internet access for ${session.macAddress}:`, error.message);  
      }

    
  }
};