require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const connection = require("./config/db");
const members = require("./routes/members");
const login_members = require("./routes/login_members");
const pay_register = require("./routes/pay.register");
connection();

// middlewares
app.use(express.json());
app.use(cors());
// routes
app.use("/platform/v1/members", members);
app.use("/platform/v1/login_members", login_members);
app.use("/platform/v1/pay_register", pay_register);
console.log("asdasdsadas");
const port = process.env.PORT || 8006;
app.listen(port, console.log(`Listening on port ${port}...`));
