// services/mtnService.js

const axios = require("axios");

// services/mtn.service.js

exports.requestToPay = async ({
  amount,
  phoneNumber,
  externalId
}) => {

  // simulate delay
  await new Promise(resolve =>
    setTimeout(resolve, 2000)
  );

  // random success/failure
//   const success = Math.random() > 0.3;

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

};