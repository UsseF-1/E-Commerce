const express = require("express")
const router = express.Router()
const roles = require("../utils/usersRoles")
const categoryControllers = require("../controllers/category.controllers")
const autheticate = require("../middlewares/authenticate")
const authorization = require("../middlewares/authorization")

router.route("/")
                .post(autheticate, authorization(roles.ADMIN) , categoryControllers.createCategory)
                .get(autheticate, authorization(roles.ADMIN), categoryControllers.getCategories)

router.route("/:name")
                    .get(autheticate, authorization(roles.ADMIN), categoryControllers.getCategory)
                    .put(autheticate, authorization(roles.ADMIN), categoryControllers.updateCategory)
                    .delete(autheticate, authorization(roles.ADMIN), categoryControllers.deleteCategory)                    

module.exports = router