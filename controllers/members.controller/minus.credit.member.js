const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Members, validate } = require("../../models/members.model");
const { MoneyHistory } = require("../../models/money.history.model");
const CheckHeader = require("../../check.header/nbadigitalservice");

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    await CheckHeader(req, res);
    if (!req.body || !id || !req.body.timestamp)
      return res.send("กรุณากรอกข้อมูลให้ครบด้วย.");

    const user = await Members.findOne({
      _id: id,
    });
    if (user) {
      const newCredit = user.mem_credit - req.body.mem_credit;
      await Members.findByIdAndUpdate(
        user._id,
        { mem_credit: newCredit },
        { useFindAndModify: false }
      );
      const newHistory = {
        mem_id: id,
        detail: req.body.detail,
        amount: req.body.mem_credit,
        type: "minus",
        timestamp: req.body.timestamp,
      };
      await new MoneyHistory({
        ...newHistory,
      }).save();
      res.status(201).send({ message: "สร้างข้อมูลสำเร็จ", status: true });
    } else {
      res.status(500).send({
        message: "ไม่มีผู้ใช้งานนนี้ในระบบ",
        status: false,
      });
    }
  } catch (error) {
    res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
  }
};
