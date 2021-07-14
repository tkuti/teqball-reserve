const express = require("express");
const router = express.Router();
const LoginController = require("../controllers/LoginController");



router.get("/", LoginController.googleSetup);

router.post("/check", LoginController.checkingLogin);



module.exports = router;