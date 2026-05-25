const express = require("express");

const router = express.Router();

const { getPublicHotspot, getPublicPackages } = require("../controllers/public.controller");

router.get("/hotspots/:hotspotId", getPublicHotspot);
router.get("/packages/:hotspotId", getPublicPackages);

module.exports = router;