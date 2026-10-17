const {body} = require("express-validator")

const registerValidation = [
    body("firstName")
        .notEmpty()
        .withMessage("First Name is required")
        .isLength({ min: 3 }),
    body("lastName")
        .notEmpty()
        .withMessage("Last Name is required")
        .isLength({ min: 3 }),
    body("email")
        .notEmpty()
        .isEmail()
        .withMessage("Email is required"),
    body("password")
        .notEmpty()
        .isLength({ min: 6, max: 12 })
        .withMessage("Password is required"),
    body("phone")
        .notEmpty()
        .isLength({ min: 11, max: 11 })
        .withMessage("phone number is required"),
]

const loginValidation = [
    body("email")
        .notEmpty()
        .isEmail()
        .withMessage("Email is required"),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
]

module.exports = {
    registerValidation,
    loginValidation
}