require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const url = process.env.MONGO_URL

mongoose.connect(url).then(() => {
    console.log("DB Is Connected!");
})

app.listen(process.env.PORT || 2000, () => {
    console.log("Server is running on Port ", process.env.PORT || 2000);
})