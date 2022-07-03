const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Members, validate } = require("../../models/members.model");
const { MoneyHistory } = require("../../models/money.history.model");

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    if (!req.body || !id) return res.send("กรุณากรอกข้อมูลให้ครบด้วย.");

    const user = await Members.findOne({
      _id: id,
    });
    if (user) {
      const newCredit = user.mem_credit + req.body.mem_credit;
      await Members.findByIdAndUpdate(
        user._id,
        { mem_credit: newCredit },
        { useFindAndModify: false }
      );
      const newHistory = {
        mem_id: id,
        detail: req.body.detail,
        amount: req.body.mem_credit,
        type: "add",
      };
      await new MoneyHistory({
        ...newHistory,
      }).save();
      res.status(201).send({ message: "สร้างข้อมูลสำเร็จ", status: true });
    } else {
      res.status(200).send({
        message: "ไม่มีผู้ใช้งานนนี้ในระบบ",
        status: true,
      });
    }
  } catch (error) {
    res.status(200).send({
      message: "ไม่มีผู้ใช้งานนนี้ในระบบ",
      status: true,
    });
  }
};
