const reviewServices = require("../services/review.services")
const appError = require("../utils/appError")
const httpStatusText = require("../utils/httpStatusText")
const asyncWrapper = require("../middlewares/asyncWrapper")

const addReview = asyncWrapper(async (req, res) => {
    const result = await reviewServices.addReview(req.body, req.user.id);
    res.status(201).json({Status: httpStatusText.SUCCESS, message: "Review is created", data: result})
})

const getProductReviews = asyncWrapper(async (req, res) => {
    const result = await reviewServices.getProductReviews(req.params.id);
    res.status(200).json({Status: httpStatusText.SUCCESS, message: "Reviews displayed successfully", data: result});
});

const updateReview = asyncWrapper(async (req, res) => {
    const result = await reviewServices.updateReview(req.params.id, req.body, req.user.id);
    res.status(200).json({Status: httpStatusText.SUCCESS, message: "Review updated successfully", data: result});
});

const deleteReview = asyncWrapper(async (req, res) => {
    await reviewServices.deleteReview(req.params.id, req.user);
    res.status(200).json({Status: httpStatusText.SUCCESS, message: "Review deleted successfully", data: null});
});

module.exports = {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview
}