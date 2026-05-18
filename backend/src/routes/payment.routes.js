

const router = require("express").Router();

const { initiatePayment, mockSuccess } = require("../controllers/payment.controller");

// NO AUTH customer initiates payment
router.post("/initiate", initiatePayment);

// NO AUTH for development purposes
// if (process.env.NODE_ENV === 'development') {
  router.post("/mock-success/:id", mockSuccess);
// }

module.exports = router;