const express = require('express');
const {
addStyle,
getStyle,
uploadFile
}=require("../Controller/StyleController");
const {upload1}= require("../Middleware/middleware")

const router = express.Router();
router.post("/add", upload1.single("img"), addStyle);
router.route("/get").get(getStyle);

module.exports = router;