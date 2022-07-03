const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const MoneyHistorySchema = new mongoose.Schema({
  mem_id: { type: String, required: true },
  detail: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true, default: "add" },
  timestamp: { type: Date, required: false, default: Date.now() },
});

MoneyHistorySchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const MoneyHistory = mongoose.model("money_history", MoneyHistorySchema);

const validate = (data) => {
  const schema = Joi.object({
    mem_id: Joi.string().default("slip"),
    detail: Joi.string(),
    amount: Joi.number().precision(3),
    type: Joi.string().default("add"),
    timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { MoneyHistory, validate };
