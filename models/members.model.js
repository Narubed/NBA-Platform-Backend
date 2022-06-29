const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 6,
  max: 20,
  lowerCase: 0,
  upperCase: 0,
  numeric: 0,
  symbol: 0,
  requirementCount: 2,
};

const membersSchema = new mongoose.Schema({
  ref_id: { type: String, required: true },
  card_number: { type: String, required: true },
  mem_package: { type: String, required: true },
  mem_name: { type: String, required: true },
  mem_tel: { type: String, required: true },
  mem_password: { type: String, required: true },
  mem_iden: { type: String, required: true },
  img_iden: { type: String, required: true },
  mem_bank: { type: String, required: true },
  mem_bank_num: { type: String, required: true },
  img_bank: { type: String, required: true },
  mem_address: { type: String, required: true },
  mem_subdistrict: { type: String, required: true },
  mem_district: { type: String, required: true },
  mem_province: { type: String, required: true },
  mem_start: { type: Date, required: false, default: Date.now() },
  mem_expire: { type: Date, required: false, default: Date.now() },
  mem_money: { type: Number, required: true, default: 0 },
  mem_credit: { type: Number, required: true, default: 0 },
  mem_status: {
    type: String,
    required: true,
    default: "process",
  },
});

membersSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Members = mongoose.model("members", membersSchema);

const validate = (data) => {
  const schema = Joi.object({
    ref_id: Joi.string(),
    card_number: Joi.string(),
    mem_package: Joi.string(),
    mem_name: Joi.string(),
    mem_tel: Joi.string(),
    mem_password: passwordComplexity(complexityOptions),
    mem_iden: Joi.string(),
    img_iden: Joi.string(),
    mem_bank: Joi.string(),
    mem_bank_num: Joi.string(),
    img_bank: Joi.string(),
    mem_address: Joi.string(),
    mem_subdistrict: Joi.string(),
    mem_district: Joi.string(),
    mem_province: Joi.string(),
    mem_start: Joi.date().raw().default(Date.now()),
    mem_expire: Joi.date().raw().default(Date.now()),
    mem_money: Joi.number().precision(3).default(0),
    mem_credit: Joi.number().precision(3).default(0),
    mem_status: Joi.string().default("process"),
  });
  return schema.validate(data);
};

module.exports = { Members, validate };
