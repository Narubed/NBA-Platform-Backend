const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const {
  CounterEvidence,
  validate,
} = require("../../models/counter.evidence.model");
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
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.create = async (req, res) => {
  try {
    await CheckHeader(req, res);
    let upload = multer({ storage: storage }).single("evidence_img");
    upload(req, res, function (err) {
      if (!req.file) {
        return res.send("กรุณาส่งไฟล์รูปภาพมาด้วย.");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }
      uploadFileCreate(req, res);
    });
    async function uploadFileCreate(req, res) {
      const filePath = req.file.path;
      let fileMetaData = {
        name: req.file.originalname,
        parents: ["1BAjsr22ne98_gstBtotS9ggAIsQreoq5"],
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
        const { error } = validate(req.body);
        if (error)
          return res.status(400).send({ message: error.details[0].message });

        await new CounterEvidence({
          ...req.body,
          evidence_img: response.data.id,
        }).save();
        res.status(201).send({
          message: "เพิ่มข้อมูลรายงานสำเร็จ",
          status: true,
        });
      } catch (error) {
        res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
      }
    }
  } catch (error) {
    console.log(error.massage);
  }
};
async function generatePublicUrl(res) {
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
  } catch (error) {
    console.log(error.message);
  }
}
