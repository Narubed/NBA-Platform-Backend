const router = require("express").Router();
const create_members = require("../controllers/members.controller/create.members");
const update_members = require("../controllers/members.controller/update.members");
const members = require("../controllers/members.controller");

router.post("/", create_members.create);
router.put("/:id", update_members.update);

router.get("/", members.findAll);
router.get("/:id", members.findOne);
router.get("/tel/:id", members.findByTel);
router.delete("/:id", members.delete);

// router.get("/", members.findAll);
// router.get("/:id", members.findOne);
// router.get("/phone/:id", members.findByPhone);

// router.delete("/:id", members.delete);

module.exports = router;
