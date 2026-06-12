// routes/dashboard.routes.js

const router = require("express").Router();

const { getDashboardStats } = require("../controllers/dashboard.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get("/stats", authMiddleware, getDashboardStats);

module.exports = router;