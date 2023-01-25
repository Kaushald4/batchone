"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.signUp = exports.cookieOptions = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_schema_1 = __importDefault(require("../models/user.schema"));
const asyncHandler_1 = __importDefault(require("../services/asyncHandler"));
const customError_1 = __importDefault(require("../utils/customError"));
const mailHelper_1 = __importDefault(require("../utils/mailHelper"));
exports.cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    //could be in a separate file in utils
};
/******************************************************
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @parameters name, email, password
 * @returns User Object
 ******************************************************/
exports.signUp = (0, asyncHandler_1.default)(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new customError_1.default("Please fill all fields", 400);
    }
    //check if user exists
    const existingUser = await user_schema_1.default.findOne({ email });
    if (existingUser) {
        throw new customError_1.default("User already exists", 400);
    }
    const user = await user_schema_1.default.create({
        name,
        email,
        password,
    });
    const token = user.getJwtToken();
    console.log(user);
    user.password = undefined;
    res.cookie("token", token, exports.cookieOptions);
    res.status(200).json({
        success: true,
        token,
        user,
    });
});
/******************************************************
 * @LOGIN
 * @route http://localhost:5000/api/auth/login
 * @description User signIn Controller for loging new user
 * @parameters  email, password
 * @returns User Object
 ******************************************************/
exports.login = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new customError_1.default("Please fill all fields", 400);
    }
    const user = await user_schema_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new customError_1.default("Invalid credentials", 400);
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (isPasswordMatched) {
        const token = user.getJwtToken();
        user.password = undefined;
        res.cookie("token", token, exports.cookieOptions);
        return res.status(200).json({
            success: true,
            token,
            user,
        });
    }
    throw new customError_1.default("Invalid credentials - pass", 400);
});
/******************************************************
 * @LOGOUT
 * @route http://localhost:5000/api/auth/logout
 * @description User logout bby clearing user cookies
 * @parameters
 * @returns success message
 ******************************************************/
exports.logout = (0, asyncHandler_1.default)(async (_req, res) => {
    // res.clearCookie()
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});
/******************************************************
 * @FORGOT_PASSWORD
 * @route http://localhost:5000/api/auth/password/forgot
 * @description User will submit email and we will generate a token
 * @parameters  email
 * @returns success message - email send
 ******************************************************/
exports.forgotPassword = (0, asyncHandler_1.default)(async (req, res) => {
    const { email } = req.body;
    //check email for null or ""
    const user = await user_schema_1.default.findOne({ email });
    if (!user) {
        throw new customError_1.default("User not found", 404);
    }
    const resetToken = user.generateForgotPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`;
    const text = `Your password reset url is
    \n\n ${resetUrl}\n\n
    `;
    try {
        await (0, mailHelper_1.default)({
            email: user.email,
            subject: "Password reset email for website",
            text: text,
        });
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email}`,
        });
    }
    catch (err) {
        //roll back - clear fields and save
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        throw new customError_1.default(err.message || "Email sent failure", 500);
    }
});
/******************************************************
 * @RESET_PASSWORD
 * @route http://localhost:5000/api/auth/password/reset/:resetToken
 * @description User will be able to reset password based on url token
 * @parameters  token from url, password and confirmpass
 * @returns User object
 ******************************************************/
exports.resetPassword = (0, asyncHandler_1.default)(async (req, res) => {
    const { token: resetToken } = req.params;
    const { password, confirmPassword } = req.body;
    const resetPasswordToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
    // User.findOne({email: email})
    const user = await user_schema_1.default.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() },
    });
    if (!user) {
        throw new customError_1.default("password token is invalid or expired", 400);
    }
    console.log(password, confirmPassword);
    if (password !== confirmPassword) {
        throw new customError_1.default("password and conf password does not match", 400);
    }
    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpire = undefined;
    await user.save();
    //create token and send as response
    const token = user.getJwtToken();
    user.password = undefined;
    //helper method for cookie can be added
    res.cookie("token", token, exports.cookieOptions);
    res.status(200).json({
        success: true,
        user,
    });
});
// TODO: create a controller for change password
/******************************************************
 * @GET_PROFILE
 * @REQUEST_TYPE PUT
 * @route http://localhost:5000/api/auth/password/change
 * @description user will be able to change his password
 * @parameters prevPassword, newPassword
 * @returns successful message
 ******************************************************/
exports.changePassword = (0, asyncHandler_1.default)(async (req, res) => {
    const { prevPassword, newPassword, confirmNewPassword } = req.body;
    if (!prevPassword || !newPassword || !confirmNewPassword) {
        throw new customError_1.default("All fields are required!", 400);
    }
    const user = await user_schema_1.default.findOne({ email: req.user.email }).select("+password");
    if (!user) {
        throw new customError_1.default("user not found", 400);
    }
    if (newPassword !== confirmNewPassword) {
        throw new customError_1.default("password and conf password does not match", 400);
    }
    const isPasswordMatched = await user.comparePassword(prevPassword);
    if (!isPasswordMatched) {
        throw new customError_1.default("prev password is not valid!", 400);
    }
    user.password = newPassword;
    await user.save();
    user.password = undefined;
    res.status(200).json({
        success: true,
        message: "password changed successfully",
    });
});
/******************************************************
 * @GET_PROFILE
 * @REQUEST_TYPE GET
 * @route http://localhost:5000/api/auth/profile
 * @description check for token and populate req.user
 * @parameters
 * @returns User Object
 ******************************************************/
exports.getProfile = (0, asyncHandler_1.default)(async (req, res) => {
    const { user } = req;
    if (!user) {
        throw new customError_1.default("User not found", 404);
    }
    res.status(200).json({
        success: true,
        user,
    });
});
