const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const CompansationSchema = new mongoose.Schema({
  com_member_id: { type: String, required: true },
  com_project_id: { type: String, required: true },
  com_product_price: { type: Number, required: true },
  com_freight: { type: Number, required: true },
  com_vat: { type: Number, required: true },
  com_cost_price: { type: Number, required: true },
  com_cost_profit: { type: Number, required: true },
  com_lv_owner: { type: Number, required: true },
  com_lv_one: { type: Number, required: true },
  com_lv_two: { type: Number, required: true },
  com_lv_tree: { type: Number, required: true },
  com_lv_office: { type: Number, required: true },
  com_all_sale: { type: Number, required: true },
  com_funds: { type: Number, required: true },
  com_province: { type: Number, required: true },
  com_district: { type: Number, required: true },
  com_sub_district: { type: Number, required: true },
  com_bonus_staff: { type: Number, required: true },
  com_company_profit: { type: Number, required: true },
  com_timestamp: { type: Date, required: false, default: Date.now() },
});

CompansationSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Compansation = mongoose.model("compansation", CompansationSchema);

const validate = (data) => {
  const schema = Joi.object({
    com_member_id: Joi.string(),
    com_project_id: Joi.string(),

    com_product_price: Joi.number().precision(3),
    com_freight: Joi.number().precision(3),
    com_vat: Joi.number().precision(3),
    com_cost_price: Joi.number().precision(3),
    com_cost_profit: Joi.number().precision(3),
    com_lv_owner: Joi.number().precision(3),
    com_lv_one: Joi.number().precision(3),
    com_lv_two: Joi.number().precision(3),
    com_lv_tree: Joi.number().precision(3),
    com_lv_office: Joi.number().precision(3),
    com_all_sale: Joi.number().precision(3),
    com_funds: Joi.number().precision(3),
    com_province: Joi.number().precision(3),
    com_district: Joi.number().precision(3),
    com_sub_district: Joi.number().precision(3),
    com_bonus_staff: Joi.number().precision(3),
    com_company_profit: Joi.number().precision(3),
    com_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { Compansation, validate };
