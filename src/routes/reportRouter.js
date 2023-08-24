const router = require("express").Router();
const {reportController} = require("../controllers");
const {verifyToken} = require("../middleware/verify");

router.get('/daily', reportController.getDaily); // ini untuk report daily
router.get('/sold',  reportController.getProductSold); // ini untuk report sold
router.get('/sales',  reportController.getDailySalesAggregate); // ini untuk report sold

module.exports = router