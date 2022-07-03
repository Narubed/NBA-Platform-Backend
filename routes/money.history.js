const router = require("express").Router();
const MoneyHistory = require("../controllers/money.history/money.history.controller");

router.get("/", MoneyHistory.findAll);
router.get("/:id", MoneyHistory.findOne);

module.exports = router;
