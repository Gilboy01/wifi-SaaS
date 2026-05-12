// create package controller

const Package = require("../models/package.model");

exports.createPackage = async (req, res) => {

  try {

    const {
      name,
      price,
      duration,
      hotspotId,
    } = req.body;

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

    res.status(500).json({
      success: false,
      message: "error in create package controller" 
    });

  }

};

// get all packages controller

exports.getPackages = async (req, res) => {

  try {

    const packages = await Package.find({

      tenantId: req.user.tenantId,

      isActive: true

    });

    res.json({
      success: true,
      count: packages.length,
      data: packages
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "error in get all packages controller"
    });

  }

};

// get one package controller

exports.getPackage = async (req, res) => {

  try {

    const pkg = await Package.findOne({

      _id: req.params.id,

      tenantId: req.user.tenantId

    });

    if (!pkg) {

      return res.status(404).json({
        message: "Package not found"
      });

    }

    res.json({
      success: true,
      data: pkg
    });

  } catch (error) {

    res.status(500).json({
      message: "error in get package controller"
    });

  }

};

// update package controller

exports.updatePackage = async (req, res) => {

  try {

    const pkg = await Package.findOneAndUpdate(

      {
        _id: req.params.id,
        tenantId: req.user.tenantId
      },

      req.body,

      {
        new: true
      }

    );

    if (!pkg) {

      return res.status(404).json({
        message: "Package not found"
      });

    }

    res.json({
      success: true,
      data: pkg
    });

  } catch (error) {

    res.status(500).json({
      message: "Error in update package controller"
    });

  }

};

// soft delete package (disable package)

exports.deletePackage = async (req, res) => {

  try {

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
        message: "Package not found"
      });

    }

    res.json({
      success: true,
      message: "Package disabled"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error in delete package controller"
    });

  }

};