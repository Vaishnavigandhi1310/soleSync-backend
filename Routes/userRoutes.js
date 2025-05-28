const express = require('express');
const {
    addUser,
    getUser,login,
    verifyOTP,
    forgotPassword,
  resetPassword
}= require("../Controller/userController")

const router = express.Router();
router.route("/add").post(addUser);
router.route("/").get(getUser);
router.route("/login").post(login);
router.post("/verify/:email", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:email", resetPassword);


module.exports = router;