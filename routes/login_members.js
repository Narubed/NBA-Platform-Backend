const router = require("express").Router();
const { Members } = require("../models/members.model");
const bcrypt = require("bcrypt");
const Joi = require("joi");
require("dotenv").config();

router.post("/", async (req, res) => {
  // console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const member = await Members.findOne({
      mem_tel: req.body.mem_tel,
    });
    console.log(member);

    if (!member)
      return res.status(401).send({
        message: "เบอร์โทรศัพท์หรือรหัสผ่านผิด",
        status: false,
      });

    const validPassword = await bcrypt.compare(
      req.body.mem_password,
      member.mem_password
    );
    if (!validPassword)
      return res.status(401).send({
        message: "เบอร์โทรศัพท์หรือรหัสผ่านผิด",
        status: false,
      });

    const token = member.generateAuthToken();
    const data = {
      _id: member._id,
      ref_id: member.ref_id,
      card_number: member.card_number,
      mem_package: member.mem_package,
      mem_name: member.mem_name,
      mem_tel: member.mem_tel,
      mem_start: member.mem_start,
      mem_expire: member.mem_expire,
      mem_money: member.mem_money,
      mem_credit: member.mem_credit,
      mem_status: member.mem_status,
    };
    res.status(200).send({
      token: token,
      message: "logged in successfully",
      status: true,
      data,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    mem_tel: Joi.string().required().label("mem_tel"),
    mem_password: Joi.string().required().label("mem_password"),
  });
  return schema.validate(data);
};

module.exports = router;
