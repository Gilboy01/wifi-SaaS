const Hotspot = require("../models/hotspot.model");
const Package = require( "../models/package.model");

// get hotspot controller
const getPublicHotspot = async (req, res) => {
    try {
      const {  hotspotId } = req.params;

      const hotspot = await Hotspot.findById( hotspotId);

      if (!hotspot) {
        return res
          .status(404)
          .json({
            success: false,
            message:"Hotspot not found",
          });
      }

      return res.json({
        success: true,
        data: hotspot,
      });

    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({
          success: false,
          message:"Server error",
        });
    }
  };

  const getPublicPackages = async (req, res) => {
    try {
      const { hotspotId } = req.params;

      const packages = await Package.find({
          hotspotId,
          isActive: true,
        });

      return res.json({
        success: true,
        data: packages,
      });

    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({
          success: false,
          message: "Server error",
        });
    }
  };

  module.exports = { getPublicHotspot, getPublicPackages,};