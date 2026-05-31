const router = require("express").Router();
const { createStaff, getStaff, deleteStaff } = require("../controllers/staff.controller");
const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")

// register new staff by admin
router.post("/staff", authMiddleware, roleMiddleware("admin"), createStaff);

//  get staff
router.get("/staff", authMiddleware, roleMiddleware("admin"), getStaff);

// delete staff
router.delete("/staff/:id", authMiddleware, roleMiddleware("admin"), deleteStaff);


module.exports = router;
