const { sendError, sendSuccess } = require("../middleware/ErrorHandling");
const List = require("../models/List");

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
    allowed_formats: ["jpg", "jpeg", "png", "mp3", "wav"],
    resource_type: "auto",
  },
});
const parser = multer({ storage: storage });

// setUp for audio

// const createList = async (req, res) => {
//   try {
//     parser.fields([
//       { name: "image", maxCount: 1 },
//       { name: "audio", maxCount: 1 },
//     ])(req, res, async (err) => {
//       // console.log({ req: req.body });
//       console.log({ files: req.files.audio });

//       if (err) {
//         console.log({ errFromMulter: err });
//         res.status(400).json({ status: false, message: "File upload failed" });
//         return;
//       }

//       const { name, description, categoryId } = req.body;
//       const imageUrl = req?.files?.image?.[0]?.path;
//       const audioUrl = req?.files?.audio?.[0]?.path;

//       if (!imageUrl || !audioUrl) {
//         sendError(res, 400, "Both image and audio are required");
//         return;
//       }

//       const newList = new List({
//         name: name,
//         description: description,
//         image: imageUrl,
//         categoryId: categoryId,
//         audio: audioUrl,
//       });

//       await newList.save();
//       sendSuccess(res, "List added successfully");
//     });
//   } catch (e) {
//     sendError(res, 500, e.message);
//   }
// };
const createList = async (req, res) => {
  try {
    parser.fields([
      { name: "image", maxCount: 1 },
      { name: "audio", maxCount: 1 },
    ])(req, res, async (err) => {
      // console.log({ req: req.body });
      console.log({ files: req.files.audio });

      if (err) {
        console.log({ errFromMulter: err });
        res.status(400).json({ status: false, message: "File upload failed" });
        return;
      }

      const { name, description, categoryId } = req.body;
      const imageUrl = req?.files?.image?.[0]?.path;
      const audioUrl = req?.files?.audio?.[0]?.path;

      // Check if imageUrl is present and handle audioUrl accordingly
      if (!imageUrl) {
        sendError(res, 400, "Image is required");
        return;
      }

      // Optionally check if audio file is provided
      let audio = "";
      if (audioUrl) {
        audio = audioUrl;
      }

      const newList = new List({
        name: name,
        description: description,
        image: imageUrl,
        categoryId: categoryId,
        audio: audio,
      });

      await newList.save();
      sendSuccess(res, "List added successfully");
    });
  } catch (e) {
    sendError(res, 500, e.message);
  }
};

const getList = async (req, res) => {
  try {
    const { categoryId } = req.params;
    // const findId = await List.findOne({ categoryId: categoryId });
    // if (!findId) {
    //   sendSuccess(res, "", []);
    // }
    const findList = await List.find({ categoryId: categoryId });
    console.log(findList);
    sendSuccess(res, "", findList);
  } catch (e) {
    sendError(res, 500, e.message);
  }
  // /getList/:categoryId
};

//user
const getDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const findId = await List.findById({ _id: id });
    if (!findId) {
      throw new Error("Item not found");
    }
    const findListById = await List.findById({ _id: id });
    if (findListById) {
      sendSuccess(res, "", findListById);
    }
    // console.log(id);
  } catch (e) {
    sendError(res, 500, e.message);
  }
};

//admin delete
const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    console.log({ id });
    const findId = await List.findById({ _id: id });
    if (!findId) {
      throw new Error("Item not found");
    }
    const deletePost = await List.deleteOne({ _id: id });
    sendSuccess(res, "Item deleted Successfully", null);
  } catch (e) {
    sendError(res, 500, e.message);
  }
};

const updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const findId = await List.findById({ _id: id });
    if (!findId) {
      throw new Error("Item not found");
    }

    parser.fields([
      { name: "image", maxCount: 1 },
      { name: "audio", maxCount: 1 },
    ])(req, res, async (err) => {
      // console.log({ req: req.body });
      console.log({ files: req.files.audio });

      if (err) {
        console.log({ errFromMulter: err });
        res.status(400).json({ status: false, message: "File upload failed" });
        return;
      }

      const { name, description } = req.body;
      const imageUrl = req?.files?.image
        ? req?.files?.image[0].path
        : findId.image;
      const audioUrl = req?.files?.audio
        ? req?.files?.audio[0]?.path
        : findId.audio;

      const updateNow = await List.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name: name,
            description: description,
            image: imageUrl,
            audio: audioUrl,
          },
        }
      );
      updateNow && sendSuccess(res, "List updated successfully", null);
    });
  } catch (e) {
    sendError(res, 500, e.message);
  }
};

module.exports = { createList, getList, getDetails, deleteList, updateList };
