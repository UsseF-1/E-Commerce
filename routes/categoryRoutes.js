const express = require("express")
const router = express.Router()
const roles = require("../utils/usersRoles")
const categoryControllers = require("../controllers/category.controllers")
const autheticate = require("../middlewares/authenticate")
const authorization = require("../middlewares/authorization")
const validationMiddleware = require("../middlewares/validation")
const {createCategoryValidation,updateCategoryValidation} = require("../validations/category.validations")

router.route("/")
                .post(autheticate, authorization(roles.ADMIN) , createCategoryValidation, 
                    validationMiddleware, categoryControllers.createCategory)
                .get(autheticate, categoryControllers.getCategories)

router.route("/:name")
                    .get(autheticate, categoryControllers.getCategory)
                    .put(autheticate, authorization(roles.ADMIN), updateCategoryValidation,
                    validationMiddleware, categoryControllers.updateCategory)
                    .delete(autheticate, authorization(roles.ADMIN), categoryControllers.deleteCategory)                    

module.exports = router