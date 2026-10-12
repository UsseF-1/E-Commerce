const jwt = require("jsonwebtoken");
const appError = require("../utils/appError")
const httpStatusText = require("../utils/httpStatusText")

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = appError.create("Token is Required", 401 , httpStatusText.FAIL);
        return next(error);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

        req.user = {
            id: decoded.id,
            roles: decoded.roles
        }

        next();
    }
    catch (err) {
        const error = appError.create("Invalid or expired access token", 401 , httpStatusText.FAIL);
        return next(error);
    }
}

module.exports = authenticate;