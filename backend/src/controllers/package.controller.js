
const mongoose = require('mongoose');
const Package = require("../models/package.model");

// create package controller
exports.createPackage = async (req, res) => {

  try {
    // verify authentication
     if (!req.user || !req.user.tenantId) {
     return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const {
      name,
      price,
      duration,
      hotspotId,
    } = req.body;

    
   // Validate required fields
    if (!name || !price || !duration) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and duration are required"
      });
    }

    // Validate data types and ranges
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number"
      });
    }

    if (typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a positive number"
      });
    }

    const newPackage = await Package.create({

      tenantId: req.user.tenantId,
      hotspotId,
      name,
      price,
      duration,
    });

    res.status(201).json({
      success: true,
      data: newPackage
    });

  } catch (error) {
    console.error("Error creating package:", error);

    res.status(500).json({
      success: false,
      message: "error in create package controller" 
    });

  }

};

// get all packages controller

exports.getPackages = async (req, res) => {

  try {

    // Verify authentication
    if (!req.user || !req.user.tenantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Add pagination
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const query = {
      tenantId: req.user.tenantId,
      isActive: true
    };

    // const packages = await Package.find({
    //   tenantId: req.user.tenantId,
    //   isActive: true
    // });

     const [packages, total] = await Promise.all([
     Package.find(query).skip(skip).limit(limit),
      Package.countDocuments(query)
    ]);



    res.json({
      success: true,
      count: packages.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: packages
    });

  } catch (error) {
     console.error("Error fetching packages:", error);

    res.status(500).json({
      success: false,
      message: "error in get all packages controller"
    });

  }

};

// get one package controller


exports.getPackage = async (req, res) => {

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
        message: "Invalid package ID format"
      });
    }

    const pkg = await Package.findOne({

      _id: req.params.id,

      tenantId: req.user.tenantId

    });

    if (!pkg) {

      return res.status(404).json({
        success: false,
        message: "Package not found"
      });

    }

    res.json({
      success: true,
      data: pkg
    });

  } catch (error) {
    console.error("Error fetching package:", error);

    res.status(500).json({
      success: false,
      message: "error in get package controller"
    });

  }

};

// update package controller

exports.updatePackage = async (req, res) => {

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
        message: "Invalid package ID format"
      });
    }

     // Whitelist allowed update fields
   const allowedUpdates = ['name', 'price', 'duration', 'hotspotId'];
    const updates = {};
    
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

      // Validate updates
    if (updates.price !== undefined && (typeof updates.price !== 'number' || updates.price <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number"
      });
    }

     if (updates.duration !== undefined && (typeof updates.duration !== 'number' || updates.duration <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a positive number"
      });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update"
      });
    }

    const pkg = await Package.findOneAndUpdate(
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

    if (!pkg) {

      return res.status(404).json({
        success: false,
        message: "Package not found"
      });

    }

    res.json({
      success: true,
      data: pkg
    });

  } catch (error) {
    console.error("Error updating package:", error);

    res.status(500).json({
      success: false,
      message: "Error in update package controller"
    });

  }

};

// soft delete package (disable package)

exports.deletePackage = async (req, res) => {

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
        message: "Invalid package ID format"
      });
    }

    const pkg = await Package.findOneAndUpdate(

      {
        _id: req.params.id,
        tenantId: req.user.tenantId
      },

      {
        isActive: false
      },

      {
        new: true
      }

    );

    if (!pkg) {

      return res.status(404).json({
        success: false,
        message: "Package not found"
      });

    }

    res.json({
      success: true,
      message: "Package disabled"
    });

  } catch (error) {
    console.error("Error disabling package:", error);

    res.status(500).json({
      success: false,
      message: "Error in delete package controller"
    });

  }

};