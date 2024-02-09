const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [8, "Password should be at least 8 characters long"],
    },
    image: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    favorite: {
      type: Array,
      default: [],
    },
    fcmToken: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "user"], // define the roles available in your system
      required: [true, "role must be admin or user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
