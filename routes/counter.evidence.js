const router = require("express").Router();

const CounterEvidence = require("../controllers/counter.evidence.controller");
const CreateCounterEvidence = require("../controllers/counter.evidence.controller/create.evidence.service.controller");
const UpdateCounterEvidence = require("../controllers/counter.evidence.controller/update.evidence.service.controller");

router.post("/", CreateCounterEvidence.create);
router.put("/:id", UpdateCounterEvidence.update);

router.get("/", CounterEvidence.findAll);
router.get("/:id", CounterEvidence.findOne);
router.delete("/:id", CounterEvidence.delete);

module.exports = router;
