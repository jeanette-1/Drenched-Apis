const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validateToken = async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  try {
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            console.log("error", err);
            res.status(401).json({ status: false, message: "Token Expired" });
            // throw new Error("Token Expired");
            return;
          }
          req.user = decoded.user;

          const findUser = await User.findById({ _id: req.user._id });

          if (findUser?.token !== token) {
            res.status(401).json({ status: false, message: "Unauthorized" });
            return;
          }
          next();
        }
      );
    } else {
      res.status(401).json({ status: false, message: "Token Missing" });
      return;
    }
  } catch (e) {
    console.log({ e });
    res.status(401).json({ status: false, message: e.message });
  }
};

module.exports = validateToken;
