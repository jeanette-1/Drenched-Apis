const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendError, sendSuccess } = require("../middleware/ErrorHandling");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary with your credentials

cloudinary.config({
  cloud_name: "dxkkg0gih",
  api_key: "552665994149277",
  api_secret: "MlFNewU9pDODPTMf1fzgZmsI4ds",
});
// Set up multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "drenched",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const parser = multer({ storage: storage });

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
const updateProfile = async (req, res) => {
  console.log({ req: req.body });
  try {
    parser.single("image")(req, res, async (err) => {
      if (err) {
        res.status(400).json({ status: false, message: "Image upload failed" });
        return;
      }

      // If image upload succeeded, proceed to create the category

      const imageUrl = req.file ? req.file.path : ""; // Get the Cloudinary URL of the uploaded image

      const { _id } = req.user;
      console.log({ _id });

      await User.findByIdAndUpdate(
        { _id: _id },
        {
          $set: {
            image: imageUrl,
          },
        }
      );

      res
        .status(200)
        .json({ status: true, message: "User profile updated successfully" });
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: e.message,
    });
  }
};

module.exports = { register, login, changePassowrd,updateProfile };
