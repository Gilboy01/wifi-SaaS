const express = require("express");
const {
  getActiveSessions,
  disconnectSession,
  getHotspotSessions
} = require("../controllers/session.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware")

const router = express.Router();

// apply auth middleware to all routes
router.use(authMiddleware);

// active sessions
router.get("/active", roleMiddleware("admin","staff"), getActiveSessions);


// hotspot sessions
router.get("/hotspot/:hotspotId",  roleMiddleware("admin"), getHotspotSessions);


// disconnect session
router.patch("/disconnect/:id", roleMiddleware("admin"), disconnectSession);

module.exports = router;