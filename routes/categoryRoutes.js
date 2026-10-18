const express = require("express")
const router = express.Router()

const categoryControllers = require("../controllers/category.controllers")

router.route("/")
                .post(categoryControllers.createCategory)

module.exports = router