const router = require("express").Router();
const { cartController } = require("../controllers");
const { verifyToken } = require("../middleware/verify");

router.post("/start", verifyToken, cartController.createCart); // ini untuk create cart
router.patch("/remove", verifyToken, cartController.removeCartItem); // ini untuk remove cart
router.get("/list", verifyToken, cartController.getAllCartItems); // ini untuk get all cart
router.post("/make", verifyToken, cartController.checkout); // ini untuk checkout

module.exports = router;
