const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("List", ListSchema);
