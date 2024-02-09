const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      reqired: [true, "Category name is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    categoryId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
