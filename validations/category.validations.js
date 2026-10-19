const { body } = require("express-validator");

const createCategoryValidation = [
    body("categoryName")
        .notEmpty().withMessage("Category name is required")
        .isString().withMessage("Category name must be a string")
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage("Category name must be between 2 and 50 characters"),

    body("description")
        .notEmpty().withMessage("Description is required")
        .isString().withMessage("Description must be a string")
        .trim()
        .isLength({ min: 5, max: 200 }).withMessage("Description must be between 5 and 200 characters")
];

const updateCategoryValidation = [
    body("categoryName")
        .optional()
        .isString().withMessage("Category name must be a string")
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage("Category name must be between 2 and 50 characters"),

    body("description")
        .optional()
        .isString().withMessage("Description must be a string")
        .trim()
        .isLength({ min: 5, max: 200 }).withMessage("Description must be between 5 and 200 characters")
];

module.exports = {
    createCategoryValidation,
    updateCategoryValidation
};