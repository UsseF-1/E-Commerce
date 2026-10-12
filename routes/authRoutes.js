const express = require("express");
const router = express.Router()
const authController = require("../controllers/auth.controllers")

router.route("/register")
                        .post(authController.register)

module.exports = router