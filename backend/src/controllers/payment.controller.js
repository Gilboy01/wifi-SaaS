// controllers/paymentController.js

const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/payment.model");
const Package = require("../models/package.model");
const Session = require("../models/session.model");
const { requestToPay } = require("../services/mtn.service");
const { grantInternetAccess, revokeInternetAccess } = require("../services/router.service");
const { registerDevice } = require("../services/device.service");

exports.initiatePayment = async (req, res) => {

  try {

    const {  hotspotId,
      packageId,
      phoneNumber,
      macAddress  } = req.body;

  // validation
  if (!hotspotId ||!packageId ||!phoneNumber ||!macAddress) {

  return res.status(400).json({
    success: false,
    message: "All fields are required"
  });

}

   

    const externalId = uuidv4();

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

    const uppercaseMAC = macAddress.toUpperCase().trim();

// check for pending payments
const existingPending = await Payment.findOne({
    macAddress: uppercaseMAC,
    packageId,
    status: "pending"
  });

if (existingPending) {
  return res.status(400).json({
    success: false,
    message: "Pending payment already exists"
  });

}

// check if there is active session
const activeSession = await Session.findOne({
    macAddress: uppercaseMAC,
    status: "active",
    expiryTime: {
      $gt: new Date()
    }
  });

if (activeSession) {
  return res.status(400).json({
    success: false,
    message:"Device already has internet access"
  });

}


// create payment record
    const payment = await Payment.create({
  tenantId,
  hotspotId,
  packageId,
  amount: pkg.price,
  phoneNumber,
  macAddress: uppercaseMAC,
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
    // store provider transaction id
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

    if (payment.status === "failed" || payment.status === "inactive") {

  return res.status(400).json({
    success: false,
    message: "Cannot process failed / inactive payment"
  });

}
// MAC address validation
   const normalizedMac = payment.macAddress.toUpperCase().trim();

    // check active session
    const existingSession = await Session.findOne({
    macAddress: normalizedMac,
    status: "active",
    expiryTime: { $gt: new Date() }
  });

    if (existingSession) {

     return res.status(400).json({
    success: false,
    message: "Device already has active session"
  });

}

  // get package
    const pkg = await Package.findById(payment.packageId);

    if (!pkg) {

  return res.status(404).json({
    success: false,
    message: "Package no longer exists"
  });

   }
   
   //register device
   const device = await registerDevice({
     tenantId: payment.tenantId,
     hotspotId: pkg.hotspotId,
     macAddress: normalizedMac
    });
    
    // for stronger relationship between payment n device model
    // attach device to payment
    payment.deviceId = device._id;


         // Grant internet access FIRST
    try {
      await grantInternetAccess({
        hotspotId: pkg.hotspotId,
        macAddress: normalizedMac
      });
    } catch (error) {
      console.error("Router grant error", error);
      return res.status(500).json({
        success: false,
        message: "Failed to grant internet access"
      });
    }

    // mark payment successful only after access granted
    payment.status = "success";
    await payment.save();

    // create session
    const session = await Session.create({
      tenantId: payment.tenantId,
      hotspotId: pkg.hotspotId,
      deviceId: device._id,
      macAddress: normalizedMac,
      packageId: payment.packageId,
      startTime: new Date(),
      expiryTime: new Date(Date.now() + pkg.duration * 60 * 1000),
      status: "active"
    });

    console.log(`MAC Address - ${normalizedMac} connected to internet successfully`);

    return res.status(200).json({
      success: true,
      session
    });

       
  } catch (error) {
    console.log("Error in mock success controller", error);

    res.status(500).json({
      success: false,
      message: "Error in mock success controller"
    });

  }

};
