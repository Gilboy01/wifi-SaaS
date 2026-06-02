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
       macAddress: session.macAddress
      });

    session.status = "expired";
    await session.save();

    console.log( `Expired ${session.macAddress}, Internet blocked`);

    // update device
    await Device.findOneAndUpdate(
        {
          hotspotId: session.hotspotId,
          macAddress: session.macAddress
        },
        {
          status: "offline"
        }
      );
   } catch (error) {
        console.error( `Failed to revoke internet access for ${session.macAddress}:`, error.message);  
      }

    
  }
};