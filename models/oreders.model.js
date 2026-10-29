const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            priceAtPurchase: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "SHIPPED", "CANCELLED"],
        default: "PENDING"
    }
},
{
    timestamps: true
}
)

orderSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("Order", orderSchema)