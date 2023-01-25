"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please provide a product name"],
        trim: true,
        maxLength: [120, "Product name should be a max of 120 characters"],
    },
    price: {
        type: Number,
        required: [true, "Please provide a product price"],
        maxLength: [5, "Product price should not be more than 5 digits"],
    },
    description: {
        type: String,
        // use some form of editor - personal assignment
    },
    photos: [
        {
            secure_url: {
                type: String,
                required: true,
            },
        },
    ],
    stock: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    collectionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Collection",
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Product", productSchema);
