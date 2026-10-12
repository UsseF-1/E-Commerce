const asyncWrapper = require("../middlewares/asyncWrapper");
const authService = require("../services/auth.services");
const httpStatusText = require("../utils/httpStatusText");

const register = asyncWrapper(async (req, res) => {
    const result = await authService.register(req.body , req.get("User-Agent"));
    return res.status(201).json({status: httpStatusText.SUCCESS, message: "User registered successfully", data: result});
});

module.exports = {
    register,

};