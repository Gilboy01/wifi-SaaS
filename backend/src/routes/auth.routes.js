const router = require("express").Router();
const { register, login, logout } = require("../controllers/auth.controller");
// const auth = require("../middleware/authMiddleware");


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
// implement function to refresh token after 1 hour
// router.get("/auth/refresh", refresh-token);


module.exports = router;
