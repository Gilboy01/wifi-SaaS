// controllers/paymentController.js

const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/payment.model");
const Package = require("../models/package.model");
const Session = require("../models/session.model");
const { requestToPay } = require("../services/mtn.service");

exports.initiatePayment = async (req, res) => {

  try {

    const {  hotspotId,
      packageId,
      phoneNumber,
      macAddress  } = req.body;

    // find package
    const pkg = await Package.findOne({
       _id: packageId,
      hotspotId,
      isActive: true
    });

    if (!pkg) {

      return res.status(404).json({
        success: false,
        message: "Package not found"
      });

    }

       // derive tenant from package
    const tenantId = pkg.tenantId;

    const externalId = uuidv4();

        // create payment record

    // const payment = await Payment.create({
    //   tenantId: req.user.tenantId,
    //   phoneNumber,
    //   amount: pkg.price,
    //   provider: "MTN",
    //   packageId,
    //   macAddress,
    //   externalId,
    //   status: "pending"
    // });

    const payment = await Payment.create({
  tenantId,
  packageId,
  amount: pkg.price,
  phoneNumber,
  macAddress,
  provider: "MTN",
  externalId,
  status: "pending"
});

    // call payment provider
    const response = await requestToPay({
      amount: pkg.price,
      phoneNumber,
      externalId
    });

    // check if response is not successful
    if (!response.success) {
    payment.status = "failed";
    await payment.save();

    return res.status(400).json({
    success: false,
    message: "transaction failed"
  });
 }

    payment.transactionId = response.transactionId;

    await payment.save();

    res.json({
      success: true,
      payment
    });

  } catch (error) {
    console.log("error in initiate payment controller", error);  
    
    res.status(500).json({
      success: false,
      message: "Error in initiate payment controller"
    });

  }

};

// simulate payment success
exports.mockSuccess = async (req, res) => {

  try {

    const payment = await Payment.findById( req.params.id );

    if (!payment) {

      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });

    }

     // prevent duplicate processing
    if (payment.status === "success") {

      return res.status(400).json({
        success: false,
        message: "Payment already processed"
      });

    }

    

    // check active session
    const existingSession = await Session.findOne({
    macAddress: payment.macAddress,
    status: "active",
    expiryTime: { $gt: new Date() }
  });

    if (existingSession) {

     return res.status(400).json({
    success: false,
    message: "Device already has active session"
  });

}
    // mark payment successful
    payment.status = "success";
    await payment.save();

    // get package
    const pkg = await Package.findById(payment.packageId);

    if (!pkg) {

  return res.status(404).json({
    success: false,
    message: "Package no longer exists"
  });

}
    // create session
    const session = await Session.create({
        tenantId: payment.tenantId,
        macAddress: payment.macAddress,
        packageId: payment.packageId,
        startTime: new Date(),
        expiryTime:
          new Date(
            Date.now() + pkg.duration * 60 * 1000
          ),

        status: "active"

      });

      if (payment.status === "failed") {

  return res.status(400).json({
    success: false,
    message: "Cannot process failed payment"
  });

}

    res.json({
      success: true,
      session
    });

  } catch (error) {
    console.log("Error in mock success controller", error);

    res.status(500).json({
      message: "Error in mock success controller"
    });

  }

};