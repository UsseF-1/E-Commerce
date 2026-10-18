const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText")

module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role) || !req.user) {
            const error = appError.create("unauthorized", 401, httpStatusText.FAIL)
            return next(error)
        }
        next();
    }
}