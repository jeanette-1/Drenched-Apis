const router = require("express").Router();
const {
  addToFavorite,
  allFavorite,
  removeFromFavorite,
} = require("../controllers/FavoriteController");
const validateToken = require("../middleware/validateTokenHandler");
router.route("/addToFavorite/:id").post(validateToken, addToFavorite);
router
  .route("/removeFromFavorite/:postId")
  .delete(validateToken, removeFromFavorite);

router.route("/all").get(validateToken, allFavorite);

module.exports = router;
