const router = require("express").Router();
const {
  register,
  login,
  changePassowrd,
  updateProfile,
} = require("../controllers/authController");

const validateToken = require("../middleware/validateTokenHandler");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/changePassword").put(validateToken, changePassowrd);
router.route("/changeProfileImage").put(validateToken, updateProfile);

module.exports = router;
