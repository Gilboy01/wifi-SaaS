const { createPackage, 
    getPackages, 
    getPackage, 
    updatePackage,
     deletePackage } = require("../controllers/package.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = require("express").Router();

// apply auth middleware to all routes
router.use(authMiddleware)

// create package route
router.post("/", roleMiddleware("admin"), createPackage );

// get all packages
router.get("/", roleMiddleware("admin", "staff"), getPackages);

// get a particular package
router.get("/:id", roleMiddleware("admin", "staff"), getPackage);

// update a package
router.put("/:id", roleMiddleware("admin"), updatePackage);

// delete a package
router.delete("/:id", roleMiddleware("admin"), deletePackage )


module.exports = router;