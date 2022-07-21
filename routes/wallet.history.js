const router = require("express").Router();
const WalletHistory = require("../controllers/wallet.history/wallet.history.controller");

router.get("/", WalletHistory.findAll);
router.get("/:id", WalletHistory.findOne);
router.get("/member/:id", WalletHistory.findByMemberId);

module.exports = router;
