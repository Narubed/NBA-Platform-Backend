require("dotenv").config();
module.exports = usePoint = async (req, res) => {
  if (req.headers.origin) {
    const web = [
      "http://localhost:3000",
      "https://nbadigitalservice.com",
      "https://happy-point.nbadigitalservice.com",
      "https://nba-platform.nbadigitalservice.com",
      "https://e-branch2.nbadigitalworlds.com",
      "https://nba-platform-web.web.app",
      "https://e-service.nbadigitalservice.com",
      "https://nba-eservice.web.app",
    ];
    const findData = web.find((item) => item === req.headers.origin);
    console.log("Name web =>", findData.length);
    if (findData.length !== 0) {
      return true;
    } else {
      return error;
      // return true;
    }
  } else if (!req.headers.secret_key || !req.headers.token_key) {
    return error;
    // return true;
  } else if (
    req.headers.secret_key !== process.env.SECRET_KEY ||
    req.headers.token_key !== process.env.TOKEN_KEY
  ) {
    return error;
    // return true;
  } else {
    return true;
  }
};
