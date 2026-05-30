

const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");

const authorizeRoles = require("../middleware/role.middleware");

const { initiatePayment, mockSuccess, getPayments } = require("../controllers/payment.controller");

// NO AUTH customer initiates payment
router.post("/initiate", initiatePayment);

// NO AUTH for development purposes
// if (process.env.NODE_ENV === 'development') {
  router.post("/mock-success/:id", mockSuccess);
// }

// get payments
router.get("/", authMiddleware, authorizeRoles("admin"), getPayments);
module.exports = router;