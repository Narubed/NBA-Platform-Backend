const router = require("express").Router();

const Compansation = require("../controllers/compensation.controller");

router.post("/", Compansation.create);
router.get("/", Compansation.findAll);
router.get("/:id", Compansation.findOne);
router.delete("/:id", Compansation.delete);
router.put("/:id", Compansation.update);
router.get("/member/:id", Compansation.findMyMember);

module.exports = router;
