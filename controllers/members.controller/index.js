const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Members, validate } = require("../../models/members.model");

exports.findAll = async (req, res) => {
  try {
    Members.find()
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
  Members.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "ไม่สามารถหาผู้ใช้งานนี้ได้", status: false });
      else res.send({ data, status: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    });
};
// ค้นหาตามเบอร์
exports.findByTel = (req, res) => {
  const id = req.params.id;
  Members.find({ mem_tel: id })
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "ไม่สามารถหาผู้ใช้งานนี้ได้", status: false });
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
  Members.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `ไม่สามารถลบผู้ใช้งานนี้ได้`,
          status: false,
        });
      } else {
        res.send({
          message: "ลบผู้ใช้งานนี้เรียบร้อยเเล้ว",
          status: true,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "ไม่สามารถลบผู้ใช้งานนี้ได้",
        status: false,
      });
    });
};
