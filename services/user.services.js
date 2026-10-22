const User = require("../models/users.Model")
const RefreshSession = require("../models/refreshSession.model");
const appError = require("../utils/appError")
const httpStatusText = require("../utils/httpStatusText")
const {generateAccessToken, generateRefreshToken, hashRefreshToken} = require("../utils/generateToken")
const bcrypt = require("bcryptjs");

const addUser = async (userData, userAgent) => {
    const {firstName , lastName, email, password, role, phone} = userData

    const user = await User.findOne({email});
    if (user) {
        throw appError.create( "user is already exsist", 403 , httpStatusText.FAIL)
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
        firstName,
        lastName, 
        email, 
        password: hashPassword, 
        role, 
        phone
    })

    await newUser.save()
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken()

    await RefreshSession.create({
        userId: newUser._id,
        tokenHash: hashRefreshToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: userAgent || null
    })

    return {
        userData: {
            userId: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone,
        }
    }
}

const deleteUser = async (targetUserId, currentAdmin) => {
    if (targetUserId === currentAdmin) {
        throw appError.create("Admins cannot delete their own accounts", 400, httpStatusText.FAIL);
    }

    const deletedUser = await User.findByIdAndDelete(targetUserId);
    if (!deletedUser) {
        throw appError.create("User not found", 404, httpStatusText.FAIL);
    }
};

const getAllUsers = async () => {
    const users = await User.find({}, "-password -__v");
    return { 
        users 
    };
};

module.exports = {
    addUser,
    deleteUser,
    getAllUsers
};