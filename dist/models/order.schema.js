"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    products: {
        type: [
            {
                productId: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                count: Number,
                price: Number,
            },
        ],
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    coupon: String,
    transactionId: String,
    status: {
        type: String,
        enum: ["ORDERED", "SHIPPED", "DELIVERED", "CANCELLED"],
        default: "ORDERED",
        // can we improve this ?
    },
    //paymentMode: UPI, creditcard or wallet, COD
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Order", orderSchema);
