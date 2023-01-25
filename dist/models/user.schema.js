"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const authRoles_1 = __importDefault(require("../utils/authRoles"));
const index_1 = __importDefault(require("../config/index"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [50, "Name must be less than 50"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [8, "password must be at least 8 characters"],
        select: false,
    },
    profilePhoto: {
        imageId: String,
        imageUrl: String,
    },
    coverPhoto: {
        imageId: String,
        imageUrl: String,
    },
    phoneNo: {
        type: String,
    },
    passChangedAt: Date,
    isVerified: Boolean,
    isNewUser: Boolean,
    dob: Date,
    verificationCode: String,
    verificationCodeExpire: Date,
    lastLoginAt: Date,
    loginCount: String,
    address: {
        state: String,
        city: String,
        pincode: String,
        addressLineOne: String,
        addressLineTwo: String,
    },
    role: {
        type: String,
        enum: Object.values(authRoles_1.default),
        default: authRoles_1.default.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpire: Date,
}, {
    timestamps: true,
});
// challenge 1 - encrypt password - hooks
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
// add more featuers directly to your schema
userSchema.methods = {
    //compare password
    comparePassword: async function (enteredPassword) {
        return await bcryptjs_1.default.compare(enteredPassword, this.password);
    },
    //generate JWT TOKEN
    getJwtToken: function () {
        return jsonwebtoken_1.default.sign({
            _id: this._id,
            role: this.role,
        }, index_1.default.JWT_SECRET, {
            expiresIn: index_1.default.JWT_EXPIRY,
        });
    },
    generateForgotPasswordToken: function () {
        const forgotToken = crypto_1.default.randomBytes(20).toString("hex");
        //step 1 - save to DB
        this.forgotPasswordToken = crypto_1.default.createHash("sha256").update(forgotToken).digest("hex");
        this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
        //step 2 - return values to user
        return forgotToken;
    },
    verifySignupVerificationCode: function (verificationCode) {
        const hashedCode = crypto_1.default.createHash("sha256").update(verificationCode).digest("hex");
        if (this.verificationCodeExpire < Date.now()) {
            return false;
        }
        if (hashedCode !== this.verificationCode) {
            return false;
        }
        this.verificationCodeExpire = undefined;
        this.verificationCode = undefined;
        return true;
    },
    passwordChangedAfter: function (jwtTimeStamp) {
        console.log(this.pass_changed_at);
        if (this.pass_changed_at) {
            const changedTimeStamp = Math.floor(this.pass_changed_at.getTime() / 1000);
            return jwtTimeStamp < changedTimeStamp;
        }
        return false;
    },
};
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};
userSchema.statics.findByUsername = function (username) {
    return this.findOne({ username });
};
exports.default = mongoose_1.default.model("User", userSchema);
