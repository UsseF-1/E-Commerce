const express = require("express")
const router = express.Router()
const userControllers = require("../controllers/user.controllers")
const authenticate = require("../middlewares/authenticate");
const authorization = require("../middlewares/authorization");
const roles = require("../utils/usersRoles");

router.route("/")
                .get(authenticate, authorization(roles.ADMIN), userControllers.getAllUsers)
                .post(authenticate, authorization(roles.ADMIN), userControllers.addUser)

router.route("/:Id")
                .delete(authenticate, authorization(roles.ADMIN), userControllers.deleteUser)

module.exports = router