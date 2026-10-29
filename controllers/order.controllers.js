const orderServices = require("../services/order.services")
const asyncWrapper = require("../middlewares/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")

const createOrder = asyncWrapper(async (req, res) => {
    const result = await orderServices.createOrder(req.user.id)
    res.status(201).json({Status: httpStatusText.SUCCESS, data: "Order is created", data: result})
})

const getOrders = asyncWrapper(async (req, res) => {
    const result = await orderServices.getOrders(req.user)
    res.status(200).json({Status: httpStatusText.SUCCESS, data: result})
})

const getOrderById = asyncWrapper(async (req, res) => {
    const result = await orderServices.getOrderById(req.params.id, req.user)
    res.status(200).json({Status: httpStatusText.SUCCESS, data: result})
})

module.exports = {
    createOrder,
    getOrders,
    getOrderById
}