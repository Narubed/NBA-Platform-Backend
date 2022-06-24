const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const PayRegisterSchema = new mongoose.Schema({
  pay_type: { type: String, required: true, default: "slip" },
  mem_id: { type: String, required: true },
  amount: { type: Number, required: true },
  img_slip: { type: String, required: true },
  pay_status: { type: String, required: true, default: "process" },
  pay_timestamp: { type: Date, required: false, default: Date.now() },
});

PayRegisterSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const PayRegister = mongoose.model("pay_register", PayRegisterSchema);

const validate = (data) => {
  const schema = Joi.object({
    pay_type: Joi.string().default("slip"),
    mem_id: Joi.string().required().label("mem_id"),
    amount: Joi.number().precision(3),
    img_slip: Joi.string(),
    pay_status: Joi.string().default("process"),
    pay_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { PayRegister, validate };
