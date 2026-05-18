const express = require("express");

const router = express.Router();

const { createHotspot, getAllHotspots } = require("../controllers/hotspot.controller");

const authMiddleware = require("../middleware/auth.middleware");

const authorizeRoles = require("../middleware/role.middleware");

// create Hotspot
router.post("/", authMiddleware, authorizeRoles("admin"), createHotspot );

// get all Hotspots
router.get("/", authMiddleware, authorizeRoles("admin"), getAllHotspots)

// get a Hotspot
// router.get("/:id", authMiddleware, authorizeRoles("admin"), getHotspot);

// update a Hotspot
// router.put("/:id", authMiddleware, authorizeRoles("admin"), updateHotspot);

// Delete a Hotspot
// router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteHotspot);
module.exports = router;