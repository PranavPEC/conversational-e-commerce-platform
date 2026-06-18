import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            // Price snapshot — store price at time of order
            // because product prices can change later
            price: {
                type: Number,
                required: true
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["placed", "shipped", "delivered", "cancelled"],
        default: "placed"
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },

    // Step 12 — Razorpay
    razorpayOrderId: {
        type: String
    },

    razorpayPaymentId: {
        type: String
    }

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;