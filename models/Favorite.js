const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  postId: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    min: 5,
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  categoryId: {
    type: String,
    required: [true, "Please select the category"],
  },
  audio: {
    type: String,
  },
  categoryName: {
    type: String,
  },
});
module.exports = mongoose.model("Favorite", FavoriteSchema);
