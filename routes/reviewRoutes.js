const express = require("express")
const router = express.Router()
const reviewControllers = require("../controllers/review.controllers")
const authenticate = require("../middlewares/authenticate");
const authorization = require("../middlewares/authorization");
const roles = require("../utils/usersRoles");

router.route("/product/:id")
                    .get(reviewControllers.getProductReviews);

router.route("/")
                    .post(authenticate, authorization(roles.CLIENT), reviewControllers.addReview)

router.route("/:id")
                    .put(authenticate, authorization(roles.CLIENT), reviewControllers.updateReview)
                    .delete(authenticate, authorization(roles.CLIENT, roles.ADMIN), reviewControllers.deleteReview);

module.exports = router