const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Members, validate } = require("../../models/members.model");
const { MoneyHistory } = require("../../models/money.history.model");

exports.update = async (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  console.log(id);
  try {
    if (!req.body || !id) return res.send("กรุณากรอกข้อมูลให้ครบด้วย.");

    const user = await Members.findOne({
      _id: id,
    });
    if (user) {
      const newCredit = user.mem_credit - req.body.mem_credit;
      console.log(newCredit);
      console.log(user);
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
