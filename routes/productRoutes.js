const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/product.Controllers");
const authenticate = require("../middlewares/authenticate");
const authorization = require("../middlewares/authorization");
const validationMiddleware = require("../middlewares/validation");
const roles = require("../utils/usersRoles");
const { createProductValidation, updateProductValidation } = require("../validations/product.validation");

router.route("/")
                    .get(productControllers.getProducts)

                    .post(authenticate, authorization(roles.ADMIN, roles.SELLER), createProductValidation,
                        validationMiddleware, productControllers.createProduct)
router.route("/:Id")
                    .get(productControllers.getProduct)

                    .put(authenticate, authorization(roles.ADMIN, roles.SELLER), updateProductValidation,
                        validationMiddleware, productControllers.updateProduct)

                    .delete(authenticate, authorization(roles.ADMIN, roles.SELLER), productControllers.deleteProduct)

module.exports = router