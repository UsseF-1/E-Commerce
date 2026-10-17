const asyncWrapper = require("../middlewares/asyncWrapper");
const authService = require("../services/auth.services");
const httpStatusText = require("../utils/httpStatusText");
const { refreshCookieOptions } = require("../utils/cookieOptions");

const register = asyncWrapper(async (req, res) => {
    const result = await authService.register(req.body , req.get("User-Agent"));
    return res.status(201).json({status: httpStatusText.SUCCESS, message: "User registered successfully", data: result});
});

const login = asyncWrapper(async (req, res) => {
    const result = await authService.login(req.body , req.get("User-Agent"));

    res.cookie(
        "refreshToken",
        result.refreshToken,
        refreshCookieOptions
    );

    res.status(200).json({
        status: httpStatusText.SUCCESS, 
        message: "Login successfully", 
        data: {user: result.user,accessToken: result.accessToken}});
}) 

module.exports = {
    register,
    login,
};