"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpay = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const index_1 = __importDefault(require("./index"));
exports.razorpay = new razorpay_1.default({
    key_id: index_1.default.RAZORPAY_KEY_ID,
    key_secret: index_1.default.RAZORPAY_SECRET,
});
