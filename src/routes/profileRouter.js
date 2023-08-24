const router = require("express").Router();
const {profileController} = require("../controllers")
const multer = require("../middleware/multer");
const {verifyToken} = require("../middleware/verify");

router.post("/picture", verifyToken, multer.single("imgProfile"), profileController.uploadImage); // ini untuk upload image

module.exports = router