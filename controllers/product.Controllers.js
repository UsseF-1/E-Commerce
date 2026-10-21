const productService = require("../services/product.services");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");

const createProduct = asyncWrapper(async (req, res) => {
    const result = await productService.createProduct(req.body, req.user);

    res.status(201).json({Status: httpStatusText.SUCCESS, message: "product added successfully", data: result})
})

const getProducts = asyncWrapper(async (req, res) => {
    const result = await productService.getProducts(req.query);

    res.status(200).json({
        Status: httpStatusText.SUCCESS,
        message: "products displayed successfully",
        data: result
    });
});

const getProduct = asyncWrapper(async (req, res) => {
    const result = await productService.getProduct(req.params.Id);
    res.status(200).json({Status: httpStatusText.SUCCESS, message: "product Displayed successfully", data: result})
})

const updateProduct = asyncWrapper(async (req, res) => {
    const result = await productService.updateProduct(req.params.Id, req.body, req.user);

    res.status(200).json({Status: httpStatusText.SUCCESS, message: "product Updated successfully", data: result})
})

const deleteProduct = asyncWrapper(async (req, res) => {
    await productService.deleteProduct(req.params.Id, req.user)
    res.status(200).json({Status: httpStatusText.SUCCESS, message: "product deleted successfully", data: null})
})

const getMyProducts = asyncWrapper(async (req, res) => {
    const result = await productService.getMyProducts(req.user.id);
    res.status(200).json({Status: httpStatusText.SUCCESS, message: "product Displayed successfully", data: result})
})

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getMyProducts
}