const router = require("express").Router();

const CounterService = require("../controllers/counter.service.controller");
const CreateCounterService = require("../controllers/counter.service.controller/create.counter.service.controller");
const UpdateCounterService = require("../controllers/counter.service.controller/update.counter.service.controller");

router.post("/", CreateCounterService.create);
router.put("/:id", UpdateCounterService.update);

router.get("/", CounterService.findAll);
router.get("/:id", CounterService.findOne);
router.delete("/:id", CounterService.delete);
router.get("/tel/:id", CounterService.findByTel);

module.exports = router;
