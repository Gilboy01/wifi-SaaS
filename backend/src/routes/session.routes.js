const express = require("express");
const {
  getActiveSessions,
  disconnectSession,
  getHotspotSessions,
  deleteSession
} = require("../controllers/session.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware")

const router = express.Router();

// apply auth middleware to all routes
router.use(authMiddleware);

// active sessions
router.get("/active", getActiveSessions);


// hotspot sessions
router.get("/", getHotspotSessions);


// disconnect session
router.patch("/disconnect/:id", roleMiddleware("admin"), disconnectSession);

// delete session
router.delete("/delete/:id", roleMiddleware("admin"), deleteSession)

module.exports = router;