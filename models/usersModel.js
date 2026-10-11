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
    roles: {
        type: String,
        required: true,
        enum: [usersRoles.ADMIN, usersRoles.CLIENT, usersRoles.SELLER],
        default: usersRoles.CLIENT
    },
    token: {
        type: String
    },
    phone: {
        type: Number,
        required: true
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    }
})

module.exports = mongoose.model("User", userSchema)