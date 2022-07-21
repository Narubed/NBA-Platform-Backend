const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Members, validate } = require("../../models/members.model");
const { WalletHistory } = require("../../models/wallet.history.model");

exports.addWallet = async (req, res) => {
  console.log(req.body);
  try {
    if (
      !req.body.timestamp ||
      !req.body.mem_id ||
      !req.body.detail ||
      !req.body.mem_amount
    )
      return res.send("กรุณากรอกข้อมูลให้ครบด้วย.");

    const user = await Members.findOne({
      _id: req.body.mem_id,
    });
    if (user) {
      const newMoney = user.mem_money + req.body.mem_amount;

      await Members.findByIdAndUpdate(
        user._id,
        { mem_money: newMoney },
        { useFindAndModify: false }
      );

      const newHistory = {
        wallet_mem_id: user._id,
        wallet_detail: req.body.detail,
        wallet_amount: req.body.mem_amount,
        wallet_timestamp: req.body.timestamp,
        wallet_type: "add",
      };
      await new WalletHistory({
        ...newHistory,
      }).save();
      res.status(201).send({ message: "สร้างข้อมูลสำเร็จ", status: true });
    } else {
      res.status(200).send({
        message: "ไม่มีผู้ใช้งานนนี้ในระบบ",
        status: false,
      });
    }
  } catch (error) {
    res.status(200).send({
      message: "ข้อมูลบางอย่างผิดพลาด",
      status: false,
    });
  }
};
