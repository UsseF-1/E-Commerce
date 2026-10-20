const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/product.Controllers");
const authenticate = require("../middlewares/authenticate");
const authorization = require("../middlewares/authorization");
const validationMiddleware = require("../middlewares/validation");
const roles = require("../utils/usersRoles");
const { createProductValidation } = require("../validations/product.validation");

router.route("/:Id").post(authenticate, authorization(roles.ADMIN, roles.SELLER), createProductValidation,
                        validationMiddleware, productControllers.createProduct)

module.exports = router