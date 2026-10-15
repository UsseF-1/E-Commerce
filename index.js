// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cors = require('cors')
// const cookieParser = require("cookie-parser");
// const httpStatusText = require("./utils/httpStatusText")
// const mongoose = require("mongoose");
// const url = process.env.MONGO_URL
// const authRoutes = require("./routes/authRoutes")

// mongoose.connect(url).then(() => {
//     console.log("DB Is Connected!");
// })

// app.use(cookieParser());
// app.use(express.json());
// app.use(cors())
// app.use("/api/auth", authRoutes)

// // handel not exist routes
// app.all('/{*splat}', (req, res, next) => {
//     return res.status(400).json({Status: httpStatusText.ERROR, message: "NOT FOUND"})
// })

// // global error handler
// app.use((error, req, res, next) => {
//     console.error("ERROR DETAILS:", error);

//     return res.status(error.status || 500).json({
//         Status: error.statusText || httpStatusText.ERROR,
//         message: error.message,
//         code: error.status || 500,
//         data: null
//     });
// });


// app.listen(process.env.PORT || 2000, () => {
//     console.log("Server is running on Port ", process.env.PORT || 2000);
// })