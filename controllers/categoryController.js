const { sendSuccess, sendError } = require("../middleware/ErrorHandling");
const Category = require("../models/Category");

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

const createCat = async (req, res) => {
  try {
    parser.single("image")(req, res, async (err) => {
      if (err) {
        res.status(400).json({ status: false, message: "Image upload failed" });
        return;
      }
      const { name } = req.body;
      const imageUrl = req.file ? req.file.path : ""; // Get the Cloudinary URL of the uploaded image

      const newCategory = new Category({
        name: name,
        image: imageUrl,
      });
      newCategory.save();
      sendSuccess(res, "Category created successfully");
    });
  } catch (e) {
    sendError(res, 500, e.message);
  }
};
const getCat = async (req, res) => {
  try {
    const get = await Category.find({});
    res.status(200).json(get);
  } catch (e) {
    sendError(res, 500, e.message);
  }
};

module.exports = { getCat, createCat };
