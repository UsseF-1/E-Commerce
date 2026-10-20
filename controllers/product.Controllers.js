const productService = require("../services/product.services");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");

const createProduct = asyncWrapper(async (req, res) => {
    const sellerId = req.params.Id;

    const result = await productService.createProduct(req.body, sellerId);

    res.status(201).json({Status: httpStatusText.SUCCESS, message: "product added successfully", data: result})
})

module.exports = {
    createProduct,

}