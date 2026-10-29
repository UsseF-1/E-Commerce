const express = require("express");
const app = express();
const cors = require('cors')
const cookieParser = require("cookie-parser");
const httpStatusText = require("./utils/httpStatusText")
const authRoutes = require("./routes/authRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const productRoutes = require("./routes/productRoutes")
const userRoutes = require("./routes/userRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")

app.use(cookieParser());
app.use(express.json());
app.use(cors())
app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/carts", cartRoutes)
app.use("/api/orders", orderRoutes)

// handel not exist routes
app.all('/{*splat}', (req, res, next) => {
    return res.status(404).json({Status: httpStatusText.ERROR, message: "NOT FOUND"})
})

// global error handler
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        status: error.statusText || httpStatusText.ERROR,
        message: error.message,
        code: statusCode,
        data: null
    });
});


module.exports = app;