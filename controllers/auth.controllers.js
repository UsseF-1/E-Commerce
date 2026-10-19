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
        data: {user: result.user , accessToken: result.accessToken}});
}) 

const forgotPassword = asyncWrapper(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email)
    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        message: result.message,
        data: null
    });
})

const resetPassword = asyncWrapper(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const result = await authService.resetPassword(
        token,
        newPassword
    );

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        message: result.message,
        data: null
    });
})

const logout = asyncWrapper(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    await authService.logout(refreshToken);

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth"
    });

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        message: "Logged out successfully",
        data: null
    });
});

const refreshToken = asyncWrapper(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;
    const result = await authService.refreshToken(incomingRefreshToken);

    return res.status(200).json({
        status: httpStatusText.SUCCESS,
        message: "Token refreshed successfully",
        data: {
            accessToken: result.accessToken
        }
    });
})

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    logout,
    refreshToken
};