const cartServices = require("../services/cart.services")
const asyncWrapper = require("../middlewares/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")

const getCart = asyncWrapper(async (req, res) => {
    const result = await cartServices.getCart(req.user.id)
    res.status(200).json({Status: httpStatusText.SUCCESS, data: result})
})

const addToCart = asyncWrapper(async (req, res) => {
    const { productId, quantity } = req.body;
    const result = await cartServices.addToCart(req.user.id, productId, quantity);
    res.status(200).json({ Status: httpStatusText.SUCCESS, message: "Item added to cart", data: result });
});

const updateCartItemQuantity = asyncWrapper(async (req, res) => {
    const { quantity } = req.body;
    const result = await cartServices.updateCartItemQuantity(req.user.id, req.params.id, quantity);
    res.status(201).json({ Status: httpStatusText.SUCCESS, message: "Item updated to cart", data: result });
})

const removeFromCart = asyncWrapper(async (req, res) => {
    const result = await cartServices.removeFromCart(req.user.id, req.params.id);
    res.status(201).json({ Status: httpStatusText.SUCCESS, message: "Item updated deleted", data: null });
})

module.exports = {
    getCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart
}