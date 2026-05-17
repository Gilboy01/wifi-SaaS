const express = require("express");

const router = express.Router();

const { createHotspot } = require("../controllers/hotspot.controller");

const authMiddleware = require("../middleware/auth.middleware");

const authorizeRoles = require("../middleware/role.middleware");

router.post("/", authMiddleware, authorizeRoles("admin"), createHotspot );

module.exports = router;