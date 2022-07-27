const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { WalletTopup, validate } = require("../../models/wallet.topup.model");

exports.findAll = async (req, res) => {
  try {
    WalletTopup.find()
      .then(async (data) => {
        res.send({ data, message: "success", status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "มีบางอย่างผิดพลาด",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  WalletTopup.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "ไม่สามารถหารายงานนี้ได้", status: false });
      else res.send({ data, status: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  WalletTopup.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `ไม่สามารถลบรายงานนี้ได้`,
          status: false,
        });
      } else {
        res.send({
          message: "ลบรายงานนี้เรียบร้อยเเล้ว",
          status: true,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "ไม่สามารถลบรายงานนี้ได้",
        status: false,
      });
    });
};
