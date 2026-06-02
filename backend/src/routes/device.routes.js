const router =
  require("express").Router();

const {
  getDevices,
  disconnectDevice
} = require("../controllers/device.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware")

// apply auth to all device routes
router.use(authMiddleware);

// get all devices
router.get( "/", getDevices);

// disconnect device
router.post( "/disconnect/:id",roleMiddleware("admin"), disconnectDevice);

module.exports = router;