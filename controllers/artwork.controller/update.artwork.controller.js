const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { ArtWork, validate } = require("../../models/artwork.model");
const { google } = require("googleapis");

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

exports.update = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).single("img_slip");
    upload(req, res, async function (err) {
      if (!req.file) {
        await updateArtWork(req, res);
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else {
        await uploadFileCreate(req, res);
      }
    });
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
        const { error } = validate(req.body);
        console.log(error);
        if (error)
          return res.status(400).send({ message: error.details[0].message });
        const id = req.params.id;
        ArtWork.findByIdAndUpdate(
          id,
          { ...req.body, img_slip: response.data.id },
          { useFindAndModify: false }
        )
          .then((data) => {
            console.log(data);
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขข้อมูลนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขข้อมูลนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "มีบ่างอย่างผิดพลาด",
              status: false,
            });
          });
      } catch (error) {
        res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
      }
    }
  } catch (error) {
    console.log(error.massage);
  }
  async function updateArtWork(req, res) {
    const id = req.params.id;
    try {
      ArtWork.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `ไม่สามารถแก้ไขข้อมูลนี้ได้`,
              status: false,
            });
          } else
            res.send({ message: "สามารถแก้ไขข้อมูลนี้ได้แล้ว", status: true });
        })
        .catch((err) => {
          res.status(500).send({
            message: `ไม่สามารถแก้ไขข้อมูลนี้ได้`,
            status: false,
          });
        });
    } catch (error) {
      res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
    }
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
