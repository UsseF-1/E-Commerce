const express = require("express")
const router = express.Router()
const orderControllers = require("../controllers/order.controllers")
const autheticate = require("../middlewares/authenticate")
const authorization = require("../middlewares/authorization")
const roles = require("../utils/usersRoles")

router.route("/")
                .get(autheticate, orderControllers.getOrders)
                .post(autheticate, authorization(roles.CLIENT), orderControllers.createOrder)

router.route("/:id")
                .get(autheticate, orderControllers.getOrderById)

module.exports = router 