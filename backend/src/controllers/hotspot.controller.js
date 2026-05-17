const Hotspot = require("../models/hotspot.model");
const bcrypt = require("bcrypt");
exports.createHotspot = async (req, res) => {

  try {

    const {
      name,
      location,
      routerIp,
      routerUsername,
      routerPassword
    } = req.body;
    // validate fields
    if (!name || !location || !routerIp || !routerUsername || !routerPassword) {
   return res.status(400).json({
     message: "All fields are required"
   });
 }

// verify req.user.tenantid exists
  if (!req.user || !req.user.tenantId) {
    return res.status(400).json({
    message: "Tenant information missing"
    });
  }

  const hashedPassword = await bcrypt.hash(routerPassword, 10);

    const hotspot = await Hotspot.create({

        tenantId:req.user.tenantId,
        name,
        location,
        routerIp,
        routerUsername,
        routerPassword:hashedPassword

      });

    res.status(201).json({
      success: true,
      hotspot: {
     id: hotspot.id,
     name: hotspot.name,
     location: hotspot.location,
     routerIp: hotspot.routerIp,
     routerUsername: hotspot.routerUsername,
     tenantId: hotspot.tenantId
   }

    });

  } catch (error) {

    console.log("Create hotspot error", error);
    res.status(500).json({
      message:"Error creating hotspot"
    });

  }

};