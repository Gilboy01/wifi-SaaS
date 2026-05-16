const router = require("express").Router();
const { createStaff } = require("../controllers/staff.controller");
const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")

// register new staff by admin
router.post("/staff", authMiddleware, roleMiddleware("admin"), createStaff);

// staff login
// router.post("/login", login);

// staff logout
// router.post("/logout", logout);

// router.get("/", authMiddleware, getProfile );
// implement function to refresh token after 1 hour
// router.get("/auth/refresh", refresh-token);


module.exports = router;
