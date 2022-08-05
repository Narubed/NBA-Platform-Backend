const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const CounterEvidenceSchema = new mongoose.Schema({
  cs_id: { type: String, required: true },
  evidence_img: { type: String, required: true },
  employee_name: { type: String, required: true },
  timestamp: { type: Date, required: false, default: Date.now() },
});

CounterEvidenceSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const CounterEvidence = mongoose.model(
  "counter_evidence",
  CounterEvidenceSchema
);

const validate = (data) => {
  const schema = Joi.object({
    cs_id: Joi.string(),
    evidence_img: Joi.string(),
    employee_name: Joi.string(),
    timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { CounterEvidence, validate };
