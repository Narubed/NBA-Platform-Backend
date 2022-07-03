const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const ArtWorkSchema = new mongoose.Schema({
  cus_name: { type: String, required: true },
  cus_tel: { type: String, required: true },
  cus_lineid: { type: String, required: true, default: " " },
  cus_address: { type: String, required: true, default: "ไม่มีการจัดส่ง" },
  project_type: { type: String, required: true },
  project_detail: { type: Array, default: [] },
  project_sentprice: { type: Number, required: true, default: 0 },
  project_total: { type: Number, required: true, default: 0 },
  project_cost: { type: Number, required: true, default: 0 },
  vat: { type: Number, required: true, default: 0 },
  project_status: { type: String, required: true, default: "paycheck" },
  img_slip: { type: String, required: true },
  tracking_number: { type: String, required: true, default: " " },
  express_brand: { type: String, required: true, default: " " },
  timestamp: { type: Date, required: false, default: Date.now() },
});

ArtWorkSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const ArtWork = mongoose.model("art_work", ArtWorkSchema);

const validate = (data) => {
  const schema = Joi.object({
    cus_name: Joi.string(),
    cus_tel: Joi.string(),
    cus_lineid: Joi.string().default(" "),
    cus_address: Joi.string().default("ไม่มีการจัดส่ง"),
    project_type: Joi.string(),
    project_detail: Joi.array().default([]),
    project_sentprice: Joi.number().precision(3).default(0),
    project_total: Joi.number().precision(3).default(0),
    project_cost: Joi.number().precision(3).default(0),
    vat: Joi.number().precision(3).default(0),
    project_status: Joi.string().default("paycheck"),
    img_slip: Joi.string(),
    tracking_number: Joi.string().default(" "),
    express_brand: Joi.string().default(" "),
    timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { ArtWork, validate };
