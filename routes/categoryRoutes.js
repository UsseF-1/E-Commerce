const express = require("express")
const router = express.Router()
const roles = require("../utils/usersRoles")
const categoryControllers = require("../controllers/category.controllers")
const autheticate = require("../middlewares/authenticate")
const authorization = require("../middlewares/authorization")

router.route("/")
                .post(autheticate, authorization(roles.ADMIN) , categoryControllers.createCategory)
                .get(autheticate, authorization(roles.ADMIN), categoryControllers.getCategories)

module.exports = router