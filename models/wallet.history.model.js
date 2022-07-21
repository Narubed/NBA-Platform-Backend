const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const WalletHistorySchema = new mongoose.Schema({
  wallet_mem_id: { type: String, required: true },
  wallet_detail: { type: String, required: true },
  wallet_amount: { type: Number, required: true },
  wallet_type: { type: String, required: true, default: "add" },
  wallet_timestamp: { type: Date, required: false, default: Date.now() },
});

WalletHistorySchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const WalletHistory = mongoose.model("wallet_history", WalletHistorySchema);

const validate = (data) => {
  const schema = Joi.object({
    wallet_mem_id: Joi.string().default("slip"),
    wallet_detail: Joi.string(),
    wallet_amount: Joi.number().precision(3),
    wallet_type: Joi.string().default("add"),
    wallet_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { WalletHistory, validate };
