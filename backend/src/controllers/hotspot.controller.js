const mongoose = require("mongoose");
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
     tenantId: req.user.tenantId
    });

    if(hotspots.length === 0){
      return res.status(404).json({
        success: false,
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

exports.getHotspot = async(req, res) => {
  try {
     // Verify authentication
    if (!req.user || !req.user.tenantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({
            success: false,
            message: "Invalid hotspot ID format"
          });
        }

        const hotspot = await Hotspot.findOne({
          tenantId: req.user.tenantId,
          _id: req.params.id,
        })

        if(!hotspot){
          return res.status(404).json({
            success: false,
            message: "Hotspot not found"
          })
        }

        return res.status(200).json({
          success: true,
          hotspot
        })

  } catch (error) {
    console.log("Error in get hotspot controller", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hotspot try again"
    })
  }
}

exports.updateHotspot = async(req, res) => {
  try {
     // Verify authentication
    if (!req.user || !req.user.tenantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({
            success: false,
            message: "Invalid hotspot ID format"
          });
        }

        // Whitelist allowed update fields
  
    const allowedUpdates = ['name', 'location', 'routerIp', 'routerUsername', 'routerPassword', 'routerPort', 'isActive'];
    const updates = {};
    
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

      // Validate updates
    if (updates.name !== undefined && (typeof updates.name !== 'string')){
      return res.status(400).json({
        success: false,
        message: "Name of hotspot required "
      });
    }

     if (updates.location !== undefined && (typeof updates.location !== 'string')){
      return res.status(400).json({
        success: false,
        message: "Location of hotspot required "
      });
    }

     if (updates.routerIp !== undefined && (typeof updates.routerIp !== 'string')){
      return res.status(400).json({
        success: false,
        message: "Router IP address required "
      });
    }

     if (updates.routerUsername !== undefined && (typeof updates.routerUsername !== 'string')){
      return res.status(400).json({
        success: false,
        message: "routerUsername of hotspot required "
      });
    }

     if (updates.routerPassword !== undefined && (typeof updates.routerPassword !== 'string')){
      return res.status(400).json({
        success: false,
        message: "routerPassword of hotspot required "
      });
    }

     if (updates.routerPort !== undefined && (typeof updates.routerPort !== 'number' || updates.routerPort < 1)){
      return res.status(400).json({
        success: false,
        message: "routerPort of hotspot required  and should be positive"
      });
    }

      if (updates.isActive !== undefined && (typeof updates.isActive !== 'boolean')){
      return res.status(400).json({
        success: false,
        message: "isActive option of hotspot required, should be true or false"
      });
    }

     if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update"
      });
    }

    const hotspot = await Hotspot.findOneAndUpdate(
          {
            _id: req.params.id,
            tenantId: req.user.tenantId
          },
          // req.body,
          updates,
          {
            new: true,
            runValidators: true
          }
        );

          if (!hotspot) {

      return res.status(404).json({
        success: false,
        message: "hotspot not found"
      });

    }

    res.status(200).json({
      success: true,
      data: hotspot
    });
  } catch (error) {
      console.error("Error updating hotspot:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

// hotspot delete controller
exports.deleteHotspot = async (req, res) => {

  try {
     // Verify authentication
    if (!req.user || !req.user.tenantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotspot ID format"
      });
    }

    const hotspot = await Hotspot.findOneAndDelete(

      {
        _id: req.params.id,
        tenantId: req.user.tenantId
      }
    );

    if (!hotspot) {

      return res.status(404).json({
        success: false,
        message: "Hotspot not found"
      });

    }

    res.json({
      success: true,
      message: "Hotspot deleted"
    });

  } catch (error) {
    console.error("Error disabling hotspot", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};