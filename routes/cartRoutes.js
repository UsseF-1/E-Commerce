const express = require("express");
const router = express.Router()
const cartControllers = require("../controllers/cart.controllers")
const authenticate = require("../middlewares/authenticate");
const authorization = require("../middlewares/authorization");
const roles = require("../utils/usersRoles");

router.route("/")
                .get(authenticate, authorization(roles.CLIENT), cartControllers.getCart)

router.route("/items")
                .post(authenticate, authorization(roles.CLIENT), cartControllers.addToCart)

router.route("/items/:id")
                .put(authenticate, authorization(roles.CLIENT), cartControllers.updateCartItemQuantity)
                .delete(authenticate, authorization(roles.CLIENT), cartControllers.removeFromCart)

module.exports = router