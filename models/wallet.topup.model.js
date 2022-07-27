const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const WalletTopupSchema = new mongoose.Schema({
  member_id: { type: String, required: true },
  wallet_topup_type: { type: String, required: false, default: "qrcode" },
  amount: { type: Number, required: true },
  img_topup: { type: String, required: false, default: " " },
  referenceNo: { type: String, required: false, default: " " },
  gbpReferenceNo: { type: String, required: false, default: " " },
  status: { type: String, required: false, default: "process" },
  timestamp: { type: Date, required: false, default: Date.now() },
});

WalletTopupSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const WalletTopup = mongoose.model("wallet_topup", WalletTopupSchema);

const validate = (data) => {
  const schema = Joi.object({
    member_id: Joi.string(),
    wallet_topup_type: Joi.string().default("qrcode"),
    amount: Joi.number().precision(3),
    img_topup: Joi.string().default(" "),
    referenceNo: Joi.string().default(" "),
    gbpReferenceNo: Joi.string().default(" "),
    status: Joi.string().default("process"),
    timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { WalletTopup, validate };
