const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const ReportCompensationSchema = new mongoose.Schema({
  mem_id: { type: String, required: true },
  amount: { type: Number, required: true },
  vat: { type: Number, required: true },
  charge: { type: Number, required: true },
  total: { type: Number, required: true },
  timestamp: { type: Date, required: false, default: Date.now() },
});

ReportCompensationSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const ReportCompensation = mongoose.model(
  "report_compensation",
  ReportCompensationSchema
);

const validate = (data) => {
  const schema = Joi.object({
    mem_id: Joi.string().required().label("mem_id"),
    amount: Joi.number().precision(3),
    vat: Joi.number().precision(3),
    charge: Joi.number().precision(3),
    total: Joi.number().precision(3),
    timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { ReportCompensation, validate };
