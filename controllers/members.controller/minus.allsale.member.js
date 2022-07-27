const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Members } = require("../../models/members.model");
const {
  AllSaleHistory,
  validate,
} = require("../../models/allsale.history.model");

exports.minusAllSale = async (req, res) => {
  console.log(req.body);
  try {
    if (
      !req.body.timestamp ||
      !req.body.mem_id ||
      !req.body.detail ||
      !req.body.amount
    )
      return res.send("กรุณากรอกข้อมูลให้ครบด้วย.");

    const user = await Members.findOne({
      _id: req.body.mem_id,
    });
    if (user) {
      const newAllSale = user.mem_allsale - req.body.amount;

      await Members.findByIdAndUpdate(
        user._id,
        { mem_allsale: newAllSale },
        { useFindAndModify: false }
      );
      const newHistory = {
        alls_mem_id: user._id,
        alls_detail: req.body.detail,
        alls_amount: req.body.amount,
        alls_timestamp: req.body.timestamp,
        alls_type: "minus",
      };
      await new AllSaleHistory({ ...newHistory }).save();
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
      error,
    });
  }
};
