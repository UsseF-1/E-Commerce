const User = require("../models/users.Model");
const RefreshSession = require("../models/refreshSession.model");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const usersRoles = require("../utils/usersRoles");
const {generateAccessToken, generateRefreshToken, hashRefreshToken} = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

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

module.exports = {
    register,
    login
};