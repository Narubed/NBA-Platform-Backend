const router = require("express").Router();
const Create_Artwork = require("../controllers/artwork.controller/create.artwork.controller");
const Update_Artwork = require("../controllers/artwork.controller/update.artwork.controller");
const Artwork = require("../controllers/artwork.controller");

router.post("/", Create_Artwork.create);
router.put("/:id", Update_Artwork.update);

router.get("/", Artwork.findAll);
router.get("/:id", Artwork.findOne);
router.delete("/:id", Artwork.delete);

module.exports = router;
