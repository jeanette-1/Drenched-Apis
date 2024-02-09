const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendError, sendSuccess } = require("../middleware/ErrorHandling");
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (password.length < 8) {
      sendError(res, 300, "password must be 8 chatacters long ");
    }
    const findEmail = await User.findOne({ email: email });
    if (findEmail) {
      return sendError(res, 300, "Email already exist");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const registerUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });

    await registerUser.save();
    return sendSuccess(res, "User Created Successfully");
  } catch (e) {
    sendError(res, 500, e.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password, fcmToken } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      sendError(res, 400, "Email doesnot Exist");
      return;
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if (validatePassword) {
      //remove the old token
      user.token = "";
      user.fcmToken = "";

      //generate new token
      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "90000000000000h",
      });
      user.fcmToken = fcmToken ? fcmToken : null;

      //add new token
      user.token = accessToken;
      await user.save();
      sendSuccess(res, "", user);

      console.log(user);
    } else {
      sendError(res, 404, "Incorrect Password");
    }
  } catch (e) {
    sendError(res, 500, e.message);
  }
};

const changePassowrd = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (password.length < 8) {
      sendError(res, 300, "password must be 8 chatacters long ");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatePass = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    sendSuccess(res, "Password Changed Successfuly");
  } catch (e) {
    sendError(res, 500, e.message);
  }
};

module.exports = { register, login, changePassowrd };
