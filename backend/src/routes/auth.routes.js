const router = require("express").Router();
const { register, login, logout, getProfile } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware")



router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/", authMiddleware, getProfile );
// implement function to refresh token after 1 hour
// router.get("/auth/refresh", refresh-token);


module.exports = router;
