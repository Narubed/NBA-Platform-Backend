const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const {
  CounterService,
  validate,
} = require("../../models/counter.service.model");
const { google } = require("googleapis");
const CheckHeader = require("../../check.header/nbadigitalservice");

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

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
    cb(null, file.fieldname + "-" + Date.now());
  },
});

exports.update = async (req, res) => {
  try {
    await CheckHeader(req, res);
    if (!req.body) {
      return res.status(400).send({
        message: "ข้อมูลไม่ถูกต้อง",
      });
    }
    let upload = multer({ storage: storage }).single("service_img");
    upload(req, res, async function (err) {
      if (!req.file) {
        const id = req.params.id;
        CounterService.findByIdAndUpdate(id, req.body, {
          useFindAndModify: false,
        })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถแก้ไขข้อมูลนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "การเเก้ไขข้อมูลสำเร็จ.",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขข้อมูลได้",
              status: false,
            });
          });
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else {
        uploadFileCreate(req, res);
      }
      async function uploadFileCreate(req, res) {
        const filePath = req.file.path;
        let fileMetaData = {
          name: req.file.originalname,
          parents: ["1l158xAkNI7ndTF-OX6lm-fJ54iIO6erV"],
        };
        let media = {
          body: fs.createReadStream(filePath),
        };
        try {
          const response = await drive.files.create({
            resource: fileMetaData,
            media: media,
          });
          // generatePublicUrl(response.data.id);
          const id = req.params.id;
          // START
          CounterService.findByIdAndUpdate(
            id,
            { ...req.body, service_img: response.data.id },
            { useFindAndModify: false }
          )
            .then(async (data) => {
              if (!data) {
                await drive.files.delete({
                  fileId: response.data.id.toString(),
                });
                res.status(404).send({
                  message: `ไม่สามารถแก้ไขข้อมูลนี้ได้`,
                  status: false,
                });
              } else
                res.send({
                  message: "การเเก้ไขข้อมูลสำเร็จ",
                  status: true,
                });
            })
            .catch(async (err) => {
              await drive.files.delete({
                fileId: response.data.id.toString(),
              });
              res.status(500).send({
                message: "ไม่สามารถแก้ไขข้อมูลนี้ได้",
                status: false,
              });
            });

          // END
        } catch (error) {
          res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
        }
      }
    });
  } catch (error) {
    res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
  }
};
