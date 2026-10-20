const { body } = require("express-validator");

const createProductValidation = [
    body("productName")
        .notEmpty().withMessage("Product name is required")
        .isString().withMessage("Product name must be a string")
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage("Product name must be between 3 and 100 characters"),

    body("description")
        .notEmpty().withMessage("Description is required")
        .isString().withMessage("Description must be a string")
        .trim()
        .isLength({ min: 10 }).withMessage("Description must be at least 10 characters long"),

    body("price")
        .notEmpty().withMessage("Price is required")
        .isFloat({ min: 0 }).withMessage("Price must be a positive number"),

    body("stock")
        .notEmpty().withMessage("Stock is required")
        .isInt({ min: 0 }).withMessage("Stock must be an integer (0 or more)"),

    body("category")
        .notEmpty().withMessage("Category ID is required")
        .isMongoId().withMessage("Invalid Category ID format")
];

module.exports = {
    createProductValidation
};