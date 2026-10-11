const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateToken = (user) => {
    return jwt.sign({id: user._id, role: user.role}, 
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
    generateToken,
    generateRefreshToken,
    hashRefreshToken
}