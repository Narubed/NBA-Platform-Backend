const router = require("express").Router();
const CreateBySlip = require("../controllers/wallet.topup.controllers/create.by.slip");
const CreateByQRCode = require("../controllers/wallet.topup.controllers/create.by.qrcode");
const Topup = require("../controllers/wallet.topup.controllers");
const UpdateTopup = require("../controllers/wallet.topup.controllers/update.wallet.topup");

router.post("/create_by_slip/", CreateBySlip.create);
router.post("/create_by_qrcode/", CreateByQRCode.create);

router.get("/", Topup.findAll);
router.get("/:id", Topup.findOne);
router.delete("/:id", Topup.delete);
router.put("/:id", UpdateTopup.update);

module.exports = router;
