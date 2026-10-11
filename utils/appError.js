class AppError extends Error {
    constructor(message, statusCode, statusText) {
        super(message);
        this.statusCode = statusCode;
        this.statusText = statusText;
    }
}

const appError = {
    create: (message, statusCode, statusText) => {
        return new AppError(message, statusCode, statusText);
    }
};

module.exports = appError;  