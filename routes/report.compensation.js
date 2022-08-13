const router = require("express").Router();

const ReportCompensation = require("../controllers/report.compensation.controller");

router.post("/", ReportCompensation.create);
router.get("/", ReportCompensation.findAll);
router.get("/:id", ReportCompensation.findOne);
router.delete("/:id", ReportCompensation.delete);
router.put("/:id", ReportCompensation.update);
router.get("/member/:id", ReportCompensation.findByMemberId);

module.exports = router;
