// routes/voucher.routes.js

const router = require("express").Router();

const { redeemVoucher} = require("../controllers/voucher.controller");

// public route
router.post( "/redeem", redeemVoucher);

module.exports = router;