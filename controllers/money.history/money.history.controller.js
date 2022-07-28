const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { MoneyHistory, validate } = require("../../models/money.history.model");
const CheckHeader = require("../../check.header/nbadigitalservice");

exports.findAll = async (req, res) => {
  try {
    await CheckHeader(req, res);
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

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    await CheckHeader(req, res);

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
  } catch (error) {
    res.status(500).send({
      status: false,
    });
  }
};
