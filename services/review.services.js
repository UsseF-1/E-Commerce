const Product = require("../models/products.model")
const appError = require("../utils/appError")
const Review = require("../models/reviews.model")
const httpStatusText = require("../utils/httpStatusText")
const roles = require("../utils/usersRoles")

const addReview = async (reviewData, userId) => {
    const { product, rating, comment } = reviewData;

    const existingProduct = await Product.findById(product);
    if (!existingProduct || existingProduct.status !== "ACTIVE") {
        throw appError.create("Product not found", 404, httpStatusText.FAIL);
    }

    const alreadyReviewed = await Review.findOne({ user: userId, product });
    if (alreadyReviewed) {
        throw appError.create("You have already reviewed this product", 409, httpStatusText.FAIL);
    }

    const newReview = await Review.create({
        user: userId,
        product,
        rating,
        comment
    });

    await newReview.populate("user", "firstName lastName");

    return { 
        reviewData: newReview 
    };
};

const getProductReviews = async (productId) => {
    const reviews = await Review.find({ product: productId })
        .populate("user", "firstName lastName")
        .sort("-createdAt")
        .select("-__v");

    return {
        reviewsData: reviews
    }
}

const updateReview = async (reviewId, updateData, userId) => {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw appError.create("Review not found", 404, httpStatusText.FAIL);
    }

    if (review.user.toString() !== userId) {
        throw appError.create("You can only edit your own review", 403, httpStatusText.FAIL);
    }

    if (updateData.rating) review.rating = updateData.rating;
    if (updateData.comment) review.comment = updateData.comment;

    await review.save();
    await review.populate("user", "firstName lastName");

    return { reviewData: review };
};

const deleteReview = async (reviewId, currentUser) => {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw appError.create("Review not found", 404, httpStatusText.FAIL);
    }

    const isOwner = review.user.toString() === currentUser.id;
    const isAdmin = currentUser.role === roles.ADMIN;

    if (!isOwner && !isAdmin) {
        throw appError.create("You are not authorized to delete this review", 403, httpStatusText.FAIL);
    }

    await Review.findByIdAndDelete(reviewId);
};

module.exports = {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview
}