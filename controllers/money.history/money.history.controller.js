const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { MoneyHistory, validate } = require("../../models/money.history.model");

exports.findAll = async (req, res) => {
  try {
    MoneyHistory.find()
      .then(async (data) => {
        res.send({ data, message: "success", status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "มีบ่างอย่างผิดพลาด.",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  MoneyHistory.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "ไม่สามารถหาข้อมูลได้", status: false });
      else res.send({ data, status: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: "มีบ่างอย่างผิดพลาด",
        status: false,
      });
    });
};
