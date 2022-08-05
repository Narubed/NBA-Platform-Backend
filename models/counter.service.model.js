const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const CounterServiceSchema = new mongoose.Schema({
  mem_id: { type: String, required: true },
  cus_name: { type: String, required: true },
  cus_tel: { type: String, required: true },
  service_ref: { type: String, required: true },
  service_name: { type: String, required: true },
  service_detail: { type: String, required: true },
  service_amount: { type: Number, required: true },
  service_charge: { type: Number, required: true },
  service_fee: { type: Number, required: true },
  service_recieve: { type: Number, required: true },
  service_change: { type: Number, required: true },
  service_total: { type: Number, required: true },
  service_img: { type: String, required: true },
  service_status: { type: String, required: false, default: "process" },
  service_cancel: { type: String, required: false, default: " " },
  timestamp: { type: Date, required: false, default: Date.now() },
});

CounterServiceSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const CounterService = mongoose.model("counter_service", CounterServiceSchema);

const validate = (data) => {
  const schema = Joi.object({
    mem_id: Joi.string(),
    cus_name: Joi.string(),
    cus_tel: Joi.string(),
    service_ref: Joi.string(),
    service_name: Joi.string(),
    service_detail: Joi.string(),
    service_amount: Joi.number().precision(3),
    service_charge: Joi.number().precision(3),
    service_fee: Joi.number().precision(3),
    service_recieve: Joi.number().precision(3),
    service_change: Joi.number().precision(3),
    service_total: Joi.number().precision(3),
    service_img: Joi.string(),
    service_status: Joi.string().default("process"),
    service_cancel: Joi.string().default(" "),
    timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { CounterService, validate };
