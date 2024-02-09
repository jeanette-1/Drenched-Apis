const router = require("express").Router();
const { createCat, getCat } = require("../controllers/categoryController");
const validateToken = require("../middleware/validateTokenHandler");
const validateAdmin = require("../middleware/validateAdmin");

router.route("/create").post(validateToken, validateAdmin, createCat);
router.route("/allCategory").get(validateToken, getCat);

module.exports = router;
