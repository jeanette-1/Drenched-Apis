const router = require("express").Router();
const {
  createList,
  getList,
  getDetails,
  deleteList,
  updateList
} = require("../controllers/listController");
const isAdmin = require("../middleware/validateAdmin");
const validateToken = require("../middleware/validateTokenHandler");
router.route("/create").post(validateToken, isAdmin, createList);
router.route("/getList/:categoryId").get(validateToken, getList);
router.route("/getDetails/:id").get(validateToken, getDetails);
router.route("/deleteList/:id").delete(validateToken, isAdmin, deleteList);
router.route("/updateList/:id").put(validateToken, isAdmin, updateList);


module.exports = router;
