const { createPackage, 
    getPackages, 
    getPackage, 
    updatePackage,
     deletePackage } = require("../controllers/package.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = require("express").Router();
router.use(authMiddleware)

router.post("/", roleMiddleware("admin"), createPackage );
router.get("/", roleMiddleware("admin", "staff"), getPackages);
router.get("/:id", roleMiddleware("admin", "staff"), getPackage);
router.put("/:id", roleMiddleware("admin"), updatePackage);
router.delete("/:id", roleMiddleware("admin"), deletePackage )


module.exports = router;