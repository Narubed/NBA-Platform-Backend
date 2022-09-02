const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Members, validate } = require("../../models/members.model");
const { google } = require("googleapis");

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
const CheckHeader = require("../../check.header/nbadigitalservice");

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.fieldname + "-" + Date.now());
  },
});
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    await CheckHeader(req, res);
    let upload = multer({ storage: storage }).fields([
      { name: "img_iden", maxCount: 10 },
      { name: "img_bank", maxCount: 10 },
    ]);

    upload(req, res, async function (err) {
      console.log(req.files, "มีัไฟล์ไหม");
      // if (!req.files.img_iden && !req.files.img_bank) {
      if (!req.files) {
        console.log("ไม่มีรูปทั้ง 2 รูป");
        await uploadFileNoImage(req, res);
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else if (req.files.img_iden && req.files.img_bank) {
        console.log("มีรูปทั้ง 2 รูป");
        await uploadFileEditTwoImage(req, res);
      } else if (req.files.img_iden && !req.files.img_bank) {
        await console.log("มีรูป1 รูปคือ img_iden");
        uploadFileEditImageIden(req, res);
      } else if (!req.files.img_iden && req.files.img_bank) {
        console.log("มีรูป1 รูปคือ img_bank");
        await uploadFileEditImageBank(req, res);
      }
    });
  } catch (error) {
    res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
  }
  async function uploadFileEditTwoImage(req, res) {
    try {
      const filePathIden = req.files.img_iden[0].path;
      const filePathBank = req.files.img_bank[0].path;

      let fileMetaDataIden = {
        name: req.files.img_iden[0].originalname,
        parents: ["1hjY1db9rlgBzjpDo0UQ94ih_BwgZIquo"],
      };
      let fileMetaDataBank = {
        name: req.files.img_bank[0].originalname,
        parents: ["1hjY1db9rlgBzjpDo0UQ94ih_BwgZIquo"],
      };

      let mediaIden = {
        body: fs.createReadStream(filePathIden),
      };
      let mediaBank = {
        body: fs.createReadStream(filePathBank),
      };

      const responseIden = await drive.files.create({
        resource: fileMetaDataIden,
        media: mediaIden,
      });
      const responseBank = await drive.files.create({
        resource: fileMetaDataBank,
        media: mediaBank,
      });
      const { error } = validate(req.body);
      if (error)
        return res
          .status(400)
          .send({ message: error.details[0].message, status: false });
      if (req.body.mem_password) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.mem_password, salt);
        Members.findByIdAndUpdate(
          id,
          {
            ...req.body,
            mem_password: hashPassword,
            img_iden: responseIden.data.id,
            img_bank: responseBank.data.id,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      } else {
        Members.findByIdAndUpdate(
          id,
          {
            ...req.body,
            img_iden: responseIden.data.id,
            img_bank: responseBank.data.id,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      }
    } catch (error) {
      res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
    }
  }
  async function uploadFileEditImageIden(req, res) {
    try {
      const filePathIden = req.files.img_iden[0].path;

      let fileMetaDataIden = {
        name: req.files.img_iden[0].originalname,
        parents: ["1hjY1db9rlgBzjpDo0UQ94ih_BwgZIquo"],
      };

      let mediaIden = {
        body: fs.createReadStream(filePathIden),
      };

      const responseIden = await drive.files.create({
        resource: fileMetaDataIden,
        media: mediaIden,
      });

      const { error } = validate(req.body);
      if (error)
        return res
          .status(400)
          .send({ message: error.details[0].message, status: false });
      if (req.body.mem_password) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.mem_password, salt);
        Members.findByIdAndUpdate(
          id,
          {
            ...req.body,
            mem_password: hashPassword,
            img_iden: responseIden.data.id,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      } else {
        Members.findByIdAndUpdate(
          id,
          {
            ...req.body,
            img_iden: responseIden.data.id,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      }
    } catch (error) {
      res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
    }
  }
  async function uploadFileEditImageBank(req, res) {
    try {
      const filePathBank = req.files.img_bank[0].path;

      let fileMetaDataBank = {
        name: req.files.img_bank[0].originalname,
        parents: ["1hjY1db9rlgBzjpDo0UQ94ih_BwgZIquo"],
      };

      let mediaBank = {
        body: fs.createReadStream(filePathBank),
      };

      const responseBank = await drive.files.create({
        resource: fileMetaDataBank,
        media: mediaBank,
      });
      const { error } = validate(req.body);
      if (error)
        return res
          .status(400)
          .send({ message: error.details[0].message, status: false });
      if (req.body.mem_password) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.mem_password, salt);
        Members.findByIdAndUpdate(
          id,
          {
            ...req.body,
            mem_password: hashPassword,
            img_bank: responseBank.data.id,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      } else {
        Members.findByIdAndUpdate(
          id,
          {
            ...req.body,
            img_bank: responseBank.data.id,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      }
    } catch (error) {
      res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
    }
  }
  async function uploadFileNoImage(req, res) {
    console.log("อะไรวะ");
    const id = req.params.id;
    if (req.body.mem_password) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.mem_password, salt);
      Members.findByIdAndUpdate(
        id,
        {
          ...req.body,
          mem_password: hashPassword,
        },
        { useFindAndModify: false }
      )
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
              status: false,
            });
          } else
            res.send({
              message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
              status: true,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
            status: false,
          });
        });
    } else {
      console.log("ไม่มีรูปและพาร์าส");
      Members.findByIdAndUpdate(
        id,
        {
          ...req.body,
        },
        { useFindAndModify: false }
      )
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
              status: false,
            });
          } else
            res.send({
              message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
              status: true,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
            status: false,
          });
        });
    }
  }
};
