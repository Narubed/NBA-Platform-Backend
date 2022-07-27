const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const AllSaleHistorySchema = new mongoose.Schema({
  alls_mem_id: { type: String, required: true },
  alls_detail: { type: String, required: true },
  alls_amount: { type: Number, required: true },
  alls_type: { type: String, required: false, default: "minus" },
  alls_timestamp: { type: Date, required: false, default: Date.now() },
});

AllSaleHistorySchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const AllSaleHistory = mongoose.model("allsale_history", AllSaleHistorySchema);

const validate = (data) => {
  const schema = Joi.object({
    alls_mem_id: Joi.string(),
    alls_detail: Joi.string(),
    alls_amount: Joi.number().precision(3),
    alls_type: Joi.string().default("minus"),
    alls_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { AllSaleHistory, validate };
