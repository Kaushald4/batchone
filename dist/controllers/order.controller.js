"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRazorpayOrderId = void 0;
const asyncHandler_1 = __importDefault(require("../services/asyncHandler"));
const razorpay_config_1 = require("../config/razorpay.config");
/**********************************************************
 * @GENEARATE_RAZORPAY_ID
 * @route https://localhost:5000/api/order/razorpay
 * @description Controller used for genrating razorpay Id
 * @description Creates a Razorpay Id which is used for placing order
 * @returns Order Object with "Razorpay order id generated successfully"
 *********************************************************/
exports.generateRazorpayOrderId = (0, asyncHandler_1.default)(async (req, res) => {
    //get product and coupon from frontend
    //verfiy product price from backend
    // make DB query to get all products and info
    let totalAmount = 0;
    //total amount and final amount
    // coupon check - DB
    // disount
    // finalAmount = totalAmount - discount
    const options = {
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`,
    };
    const order = await razorpay_config_1.razorpay.orders.create(options);
    //if order does not exist
    // success then, send it to front end
});
