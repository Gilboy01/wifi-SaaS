const Hotspot = require("../models/hotspot.model");

exports.createHotspot = async (req, res) => {

  try {

    const {
      name,
      location,
      routerIp,
      routerUsername,
      routerPassword,
      routerPort
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


    const hotspot = await Hotspot.create({

        tenantId:req.user.tenantId,
        name,
        location,
        routerIp: routerIp.trim(),
        routerUsername: routerUsername.trim(),
        routerPassword,
        routerPort: routerPort || 8728

      });

    res.status(201).json({
      success: true,
      hotspot: {
     id: hotspot.id,
     name: hotspot.name,
     location: hotspot.location,
     routerIp: hotspot.routerIp,
     routerUsername: hotspot.routerUsername,
     routerPort: hotspot.routerPort,
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

exports.getAllHotspots = async(req,res) => {
  try {
      // Verify authentication
    if (!req.user || !req.user.tenantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    const hotspots = await Hotspot.find({
      isActive: true || false
    });

    if(!hotspots){
      return res.status(404).json({
        message: "No hotspot found"
      })
    }

    return res.status(200).json({
      success: true,
      hotspots
    })
  } catch (error) {
    console.log("Error in getAllHotspots controller", error)
    res.status(500).json({
      success: false,
      message: "error displaying hotspots"
    })
  }
}
