const mongoose = require("mongoose");
const validator = require("validator")
const usersRoles = require("../utils/usersRoles")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Email Is required"]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: [usersRoles.ADMIN, usersRoles.CLIENT, usersRoles.SELLER],
        default: usersRoles.CLIENT
    },
    phone: {
        type: String,
        required: true,
    },
    token: {
        type: String
    },
    resetPasswordToken: {
        type: String,
        default: null,
        select: false
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
        select: false
    }
})

module.exports = mongoose.model("User", userSchema)