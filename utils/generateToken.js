const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateAccessToken = (user) => {
    return jwt.sign({id: user._id, roles: user.roles}, 
        process.env.JWT_ACCESS_SECRET, 
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"})
}

const generateRefreshToken = () => {
    return crypto.randomBytes(32).toString("hex");
}

const hashRefreshToken = (refreshToken) => {
    return crypto.createHash("sha256").update(refreshToken).digest("hex");
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    hashRefreshToken
}