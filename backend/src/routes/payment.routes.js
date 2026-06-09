

const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");

const authorizeRoles = require("../middleware/role.middleware");
const rateLimit = require("express-rate-limit");
const { initiatePayment, mockSuccess, getPayments } = require("../controllers/payment.controller");

// rateLimit middleware
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many payment requests, please try again later"
});


// NO AUTH customer initiates payment
router.post("/initiate", paymentLimiter, initiatePayment);

// NO AUTH for development purposes
// if (process.env.NODE_ENV === 'development') {
  router.post("/mock-success/:id", paymentLimiter, mockSuccess);
// }

// get payments
router.get("/", authMiddleware, authorizeRoles("admin"), getPayments);
module.exports = router;