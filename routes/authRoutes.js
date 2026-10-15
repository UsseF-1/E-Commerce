const express = require("express");
const router = express.Router()
const authController = require("../controllers/auth.controllers")
const validationMiddleware = require("../middlewares/validation")
const {registerValidation} = require("../validations/auth.validations")

router.route("/register")
                        .post(registerValidation, validationMiddleware, authController.register)

module.exports = router