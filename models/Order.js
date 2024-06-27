const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "product"
            },
            qty: {
                type: Number,
                required: true
            },
        }
    ],
    status: { type: String, enum: ["places", "cancel", "deklivered"], default: "placed" },
}, { timestamps: true })

module.exports = mongoose.model("order", orderSchema)