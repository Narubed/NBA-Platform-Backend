const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { WalletTopup, validate } = require("../../models/wallet.topup.model");

exports.create = async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    console.log(error);
    if (error)
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });

    await new WalletTopup({
      ...req.body,
      wallet_topup_type: "qrcode",
    }).save();
    res.status(201).send({ message: "สร้างรายงานสำเร็จ", status: true });
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
