const Session = require("../models/session.model");


const { revokeInternetAccess } = require("../services/router.service"
);

exports.expireSessions = async () => {

  const expiredSessions =  await Session.find({

      status: "active",
      expiryTime: {
        $lt: new Date()
      }

    });


  for (const session of expiredSessions) {

    await revokeInternetAccess({ macAddress: session.macAddress, hotspotId: session.hotspotId });

    session.status = "expired";

    await session.save();

    console.log(
      `Expired ${session.macAddress}, Internet blocked`
    );

  }

};