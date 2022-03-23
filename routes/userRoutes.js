const router = require("express").Router();
const { register, login, addAvatar } = require("../controllers/userController");
const multer = require("multer");

const upload = multer({
  dest: __dirname + "./images",
});

router.post("/register", register);

router.post("/login", login);

router.post("/addAvatar", upload.single("image"), addAvatar);

module.exports = router;
