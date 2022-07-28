const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { WalletTopup, validate } = require("../../models/wallet.topup.model");

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

// Create and Save a new user
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.update = async (req, res) => {
  console.log("update");
  try {
    await CheckHeader(req, res);
    if (!req.body) {
      return res.status(400).send({
        message: "ข้อมูลไม่ถูกต้อง",
      });
    }
    let upload = multer({ storage: storage }).single("img_topup");
    upload(req, res, async function (err) {
      if (!req.file) {
        const id = req.params.id;
        WalletTopup.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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
          parents: ["1hjY1db9rlgBzjpDo0UQ94ih_BwgZIquo"],
        };
        let media = {
          body: fs.createReadStream(filePath),
        };
        try {
          const response = await drive.files.create({
            resource: fileMetaData,
            media: media,
          });
          generatePublicUrl(response.data.id);
          const id = req.params.id;
          // START
          WalletTopup.findByIdAndUpdate(
            id,
            { ...req.body, img_topup: response.data.id },
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

async function generatePublicUrl(res) {
  console.log("generatePublicUrl");
  try {
    const fileId = res;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    // console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}
