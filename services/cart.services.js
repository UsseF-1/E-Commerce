const Cart = require("../models/carts.models")
const Product = require("../models/products.model");
const appError = require("../utils/appError")
const httpStatusText = require("../utils/httpStatusText")

const getCart = async (userId) => {
    const cart = await Cart.findOne({user: userId})
        .populate("items.product", "productName price images stock status");

    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    
    let totalPrice = 0
    cart.items.forEach(item => {
        if (item.product) {
            totalPrice += item.quantity * item.product.price
        }
    });

    return {
        cartData: {
            cartId: cart._id,
            items: cart.items,
            totalPrice: Number(totalPrice.toFixed(2))
        }
    }
};

const addToCart = async (userId, productId, quantity = 1) => {
    const product = await Product.findById(productId)
    if (!product || product.status !== "ACTIVE") {
        throw appError.create("Product not found or not available", 404, httpStatusText.FAIL);
    }
    if (product.stock < quantity) {
        throw appError.create(`Not enough stock. Available: ${product.stock}`, 400, httpStatusText.FAIL);
    }

    const cart = await Cart.findOne({user: userId})
    if (!cart) {
        cart.create({user: userId, items: []})
    }

    const existingItemIndex  = cart.items.findIndex(
        items => items.product.toString() === productId
    )
    if (existingItemIndex > -1) {
        const newQuantity = cart.items[existingItemIndex].quantity + Number(quantity)
        if (newQuantity > cart.product.stock) {
            throw appError.create(`Cannot add more. Max stock is ${product.stock}`, 400, httpStatusText.FAIL);
        }
        cart.items[existingItemIndex].quantity = newQuantity;
    }
    else {
        cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save()
    return await getCart(userId)
};

const updateCartItemQuantity = async (userId, productId, quantity) => {
    if (quantity < 1) {
        throw appError.create("Quantity must be at least 1", 400, httpStatusText.FAIL);
    }

    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
        throw appError.create(`Stock limit exceeded. Available: ${product ? product.stock : 0}`, 400, httpStatusText.FAIL);
    }

    const cart = await Cart.findOne({user: userId})
    if (!cart) {
        throw appError.create("cart not found", 404, httpStatusText.FAIL)
    }

    const item = cart.items.find(item => item.product.toString() === productId)
    if (!item) {
        throw appError.create("Product not in cart", 404, httpStatusText.FAIL);
    }
    item.quantity = Number(quantity)
    await cart.save()

    return getCart(userId)
};

const removeFromCart = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw appError.create("Cart not found", 404, httpStatusText.FAIL);
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    return await getCart(userId);
};

module.exports = {
    getCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart
}