const userServices = require("../services/user.services")
const httpStatusText = require("../utils/httpStatusText")
const asyncWrapper = require("../middlewares/asyncWrapper")

const addUser = asyncWrapper(async (req, res) => {
    const result = await userServices.addUser(req.body, req.get("User-Agent"));
    res.status(201).json({Status: httpStatusText.SUCCESS, message: "User is created", data: result})
})

const deleteUser = asyncWrapper(async (req, res) => {
    await userServices.deleteUser(req.params.Id, req.user.id);
    res.status(200).json({Status: httpStatusText.SUCCESS, message: "User is deleted", data: null})
})

const getAllUsers = asyncWrapper(async (req, res) => {
    const result = await userServices.getAllUsers();
    res.status(200).json({Status: httpStatusText.SUCCESS, message: "Users are Displayed", data: result})
})

module.exports = {
    addUser,
    deleteUser,
    getAllUsers
}