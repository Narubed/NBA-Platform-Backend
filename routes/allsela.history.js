const router = require("express").Router();
const AllSelaHistory = require("../controllers/allsela.history/allsela.history.controller");

router.get("/", AllSelaHistory.findAll);
router.get("/:id", AllSelaHistory.findOne);
router.get("/member/:id", AllSelaHistory.findByMemberId);

module.exports = router;
