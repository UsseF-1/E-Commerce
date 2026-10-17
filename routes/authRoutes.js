const express = require("express");
const router = express.Router()
const authController = require("../controllers/auth.controllers")
const validationMiddleware = require("../middlewares/validation")
const {registerValidation, loginValidation} = require("../validations/auth.validations")

router.route("/register")
                        .post(registerValidation, validationMiddleware, authController.register)
router.route("/login")
                        .post(loginValidation, validationMiddleware, authController.login)
module.exports = router