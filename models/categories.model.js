const mongoose = require("mongoose")

const categoriesSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Category", categoriesSchema)