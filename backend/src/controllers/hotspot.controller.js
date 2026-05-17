const Hotspot = require("../models/hotspot.model");
exports.createHotspot = async (req, res) => {

  try {

    const {
      name,
      location,
      routerIp,
      routerUsername,
      routerPassword
    } = req.body;


    const hotspot = await Hotspot.create({

        tenantId:req.user.tenantId,
        name,
        location,
        routerIp,
        routerUsername,
        routerPassword

      });

    res.status(201).json({
      success: true,
      hotspot

    });

  } catch (error) {

    console.log("Create hotspot error", error);
    res.status(500).json({
      message:"Error creating hotspot"
    });

  }

};