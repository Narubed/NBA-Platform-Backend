const router = require("express").Router();
const create_members = require("../controllers/members.controller/create.members");
const update_members = require("../controllers/members.controller/update.members");
const add_credit = require("../controllers/members.controller/add.credit.member");
const minus_credit = require("../controllers/members.controller/minus.credit.member");
const members = require("../controllers/members.controller");

router.put("/add_credit/:id", add_credit.update);
router.put("/minus_credit/:id", minus_credit.update);

router.post("/", create_members.create);
router.put("/:id", update_members.update);

router.get("/", members.findAll);
router.get("/:id", members.findOne);
router.get("/tel/:id", members.findByTel);
router.delete("/:id", members.delete);

module.exports = router;
