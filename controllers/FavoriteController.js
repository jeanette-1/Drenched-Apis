const { sendSuccess, sendError } = require("../middleware/ErrorHandling");
const Favorite = require("../models/Favorite");
const List = require("../models/List");

const addToFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const findId = await List.findById({ _id: id });
    if (!findId) {
      throw new Error("Item not found");
    }
    const findPost = await List.findOne({
      _id: id,
    });
    console.log(findPost);
    const favoriteData = new Favorite({
      userId: req.user._id,
      name: findPost.name,
      description: findPost.description,
      image: findPost.image,
      categoryId: findPost.categoryId,
      audio: findPost.audio,
      postId: id,
    });

    console.log({ favoriteData });
    await favoriteData.save();
    sendSuccess(res, "Added to Favorite");
  } catch (e) {
    sendError(res, 500, e.message);
  }
};
const allFavorite = async (req, res) => {
  try {
    const allFav = await Favorite.find({
      userId: req.user._id,
    });
    sendSuccess(res, "", allFav);
  } catch (e) {
    sendError(res, 500, e.message);
  }
};

const removeFromFavorite = async (req, res) => {
  const { postId } = req.params;
  try {
    const findId = await List.findById({ _id: postId });
    if (!findId) {
      throw new Error("Item not found");
    }
    const del = await Favorite.deleteOne({ postId: postId });
    sendSuccess(res, "Removed from favorite");
  } catch (e) {
    sendError(res, 500, e.message);
  }
};
module.exports = { addToFavorite, allFavorite, removeFromFavorite };
