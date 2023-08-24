const router = require("express").Router();
const {userController} = require("../controllers");
const passwordValidator = require("../middleware/passwordValidator");
const resetPassMid = require("../middleware/resetPassMid")
const {verifyToken} = require("../middleware/verify");


router.post("/login", userController.loginUser);
router.post("/cashier", passwordValidator, userController.createCashier); // ini untuk create cashier
router.get("/cashier", userController.getAllCashiers); // ini untuk get all cashier
router.get("/cashier/profile", verifyToken, userController.getCashierLogin); // ini untuk get 1 cashier
router.patch("/cashier/activate", userController.cashierActive); // ini untuk delete cashier
router.patch("/cashier/deactivate", userController.cashierInActive); // ini untuk deactive cashier
router.patch("/cashier/:id", userController.updateCashier); // ini untuk update cashier
router.put("/password", userController.forgotPassword); // ini untuk forgot password
router.patch("/password",resetPassMid, userController.resetPassword); // ini untuk reset password


module.exports = router