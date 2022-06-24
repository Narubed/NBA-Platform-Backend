const router = require("express").Router();
const PayRegister = require("../controllers/pay.register.controllers");

router.post("/", PayRegister.create);
router.get("/", PayRegister.findAll);
router.get("/:id", PayRegister.findOne);
router.delete("/:id", PayRegister.delete);
router.put("/:id", PayRegister.update);
module.exports = router;
