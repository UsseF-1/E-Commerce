const Cart = require("../models/carts.models")
const Order = require("../models/oreders.model")
const Product = require("../models/products.model");
const appError = require("../utils/appError")
const httpStatusText = require("../utils/httpStatusText")
const roles = require("../utils/usersRoles")

const createOrder = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw appError.create("Your cart is empty", 400, httpStatusText.FAIL);
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
        const product = item.product;

        if (!product || product.status !== "ACTIVE") {
            throw appError.create("One or more products are no longer available", 400, httpStatusText.FAIL);
        }

        if (product.stock < item.quantity) {
            throw appError.create(
                `Not enough stock for ${product.productName}. Available: ${product.stock}`,
                400,
                httpStatusText.FAIL
            );
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            priceAtPurchase: product.price
        });
    }

    for (const item of cart.items) {
        const product = item.product;
        product.stock -= item.quantity;
        await product.save();
    }

    const newOrder = await Order.create({
        user: userId,
        items: orderItems,
        totalAmount: Number(totalAmount.toFixed(2)),
        status: "PENDING"
    });

    cart.items = [];
    await cart.save();

    return { 
        orderData: newOrder 
    };
}

const getOrders = async (currentUser) => {
    let filter = {};

    if (currentUser.role === roles.CLIENT) {
        filter = { user: currentUser.id };
    } 
    else if (currentUser.role === roles.SELLER) {
        const sellerProducts = await Product.find({ seller: currentUser.id }).select("_id");
        const productIds = sellerProducts.map(p => p._id);

        filter = { "items.product": { $in: productIds } };
    }

    const orders = await Order.find(filter)
        .populate("user", "firstName lastName email phone")
        .populate("items.product", "productName price seller")
        .sort("-createdAt")
        .select("-__v");

    return { 
        ordersData: orders 
    };
}

const getOrderById = async (orderId, currentUser) => {
    const order = await Order.findById(orderId)
        .populate("user", "firstName lastName email phone")
        .populate({
            path: "items.product",
            select: "productName price",
            populate: {
                path: "seller",
                select: "firstName lastName email"
            }
        })
        .select("-__v");

    if (!order) {
        throw appError.create("Order not found", 404, httpStatusText.FAIL);
    }

    const isAdmin = currentUser.role === roles.ADMIN
    const isOrderOwner = order.user._id.toString() === currentUser.id
    const isSellerInOrder = order.items.some(
        item => item.product && item.product.seller._id.toString() === currentUser.id
    )   

    if (!isAdmin && !isOrderOwner && !isSellerInOrder) {
        throw appError.create("You are not authorized to view this order", 403, httpStatusText.FAIL);
    }

    return { 
        orderData: order 
    };
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById
}