const User = require("../models/users.Model");
const RefreshSession = require("../models/refreshSession.model");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const usersRoles = require("../utils/usersRoles");
const {generateAccessToken, generateRefreshToken, hashRefreshToken} = require("../utils/generateToken");
const generateResetToken = require("../utils/generateResetToken");
const emailService = require("./email.service");
const bcrypt = require("bcryptjs");
const crypto = require("crypto")

const register = async (userData, userAgent) => {
    const { firstName, lastName, email, password, role, phone } = userData;

    if (!firstName || !lastName || !email || !password || !phone) {
        throw appError.create("Please provide all required fields" , 400 , httpStatusText.FAIL);
    }

    const allowedRoles = Object.values(usersRoles);

    if (role && !allowedRoles.includes(role)) {
        throw appError.create("Invalid user role" , 400 , httpStatusText.FAIL);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw appError.create("User already exists" , 409 , httpStatusText.FAIL);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || usersRoles.CLIENT,
        phone
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken();

    await RefreshSession.create({
        userId: newUser._id,
        tokenHash: hashRefreshToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: userAgent || null
    });

    return {
        user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone
        },
        accessToken,
        refreshToken
    };
};

const login = async (userData, userAgent) => {
    const {email, password} = userData

    if (!email || !password) {
        throw appError.create("Email and password are required", 400 , httpStatusText.FAIL);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw appError.create("Invalid email or password", 401, httpStatusText.FAIL);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw appError.create("Invalid email or password", 401, httpStatusText.FAIL);
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken()

    await RefreshSession.create({
        userId: user._id,
        tokenHash: hashRefreshToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: userAgent || null
    });

    return {
        user: {
        // id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        },
        accessToken,
        refreshToken
    };
};

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        return {
            message: "If the account exists, a reset link will be sent."
        };
    }

    const { resetToken, resetTokenHash } = generateResetToken();

    user.resetPasswordToken = resetTokenHash;

    user.resetPasswordExpires = new Date(
        Date.now() + 10 * 60 * 1000
    );

    await user.save();

    const resetURL =
        `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await emailService.sendPasswordResetEmail(
        user.email,
        resetURL
    );

    return {
        message: "If the account exists, a reset link will be sent."
    };
};

const resetPassword = async (token, newPassword) => {
    if (!token || !newPassword) {
        throw appError.create("Token and new password are required" , 400 , httpStatusText.FAIL);
    }

    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: tokenHash,
        resetPasswordExpires: { $gt: new Date() }
    }).select("+resetPasswordToken");

    if (!user) {
        throw appError.create(
            "Invalid or expired reset token",
            400,
            httpStatusText.FAIL
        );
    }

    user.password = await bcrypt.hash(newPassword, 10);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    await RefreshSession.updateMany(
        {
            userId: user._id,
            revokedAt: null
        },
        {
            $set: { revokedAt: new Date() }
        }
    );

    return {
        message: "Password reset successfully"
    };
};

const logout = async (refreshToken) => {
    if (!refreshToken) {
        return;
    }

    const tokenHash = hashRefreshToken(refreshToken);

    await RefreshSession.findOneAndUpdate(
        {
            tokenHash,
            revokedAt: null
        },
        {
            $set: {
                revokedAt: new Date()
            }
        }
    );
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    logout
};