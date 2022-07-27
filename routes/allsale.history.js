const router = require("express").Router();
const AllSaleHistory = require("../controllers/allsale.history/allsale.history.controller");

router.get("/", AllSaleHistory.findAll);
router.get("/:id", AllSaleHistory.findOne);
router.get("/member/:id", AllSaleHistory.findByMemberId);

module.exports = router;
