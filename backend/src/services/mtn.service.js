// services/mtnService.js

// const axios = require("axios");

// services/mtn.service.js

exports.requestToPay = async ({
  amount,
  phoneNumber,
  externalId
}) => {
try {
  // Validate inputs
  if (!amount || amount <= 0 || typeof amount !== 'number') {
    throw new Error('Invalid amount: must be a positive number');
  }
  
  if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.trim().length === 0) {
    throw new Error('Invalid phoneNumber: must be a non-empty string');
  }
  
  if (!externalId || typeof externalId !== 'string' || externalId.trim().length === 0) {
    throw new Error('Invalid externalId: must be a non-empty string');
  }

  // simulate delay
  await new Promise(resolve =>
    setTimeout(resolve, 2000)
  );

  // random success/failure
  //  const success = Math.random() > 0.3;

  //   if (!success) {

  //     return {
  //       success: false,
  //       message:"Payment request failed"

  //     };

  //   }

  // simulate success
  return {
    success: true,
    transactionId: "MTN-" + Date.now(),
     externalId
  };
} catch (error) {
  console.log("Error in mtn service helper", error);
  return {
    success: false,
    message: "Error in request-to-pay service"
  };
  }
};