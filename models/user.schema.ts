import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import AuthRoles from "../utils/authRoles";
import config from "../config/index";

import { IUserDocument, IUserModel } from "../interface/user";

const userSchema: Schema<IUserDocument, IUserModel> = new Schema(
    {
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
            enum: Object.values(AuthRoles),
            default: AuthRoles.USER,
        },
        forgotPasswordToken: String,
        forgotPasswordExpire: Date,
    },
    {
        timestamps: true,
    }
);

// challenge 1 - encrypt password - hooks
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// add more featuers directly to your schema
userSchema.methods = {
    //compare password
    comparePassword: async function (enteredPassword: string) {
        return await bcrypt.compare(enteredPassword, this.password);
    },

    //generate JWT TOKEN
    getJwtToken: function () {
        return JWT.sign(
            {
                _id: this._id,
                role: this.role,
            },
            config.JWT_SECRET as string,
            {
                expiresIn: config.JWT_EXPIRY,
            }
        );
    },

    generateForgotPasswordToken: function () {
        const forgotToken = crypto.randomBytes(20).toString("hex");

        //step 1 - save to DB
        this.forgotPasswordToken = crypto.createHash("sha256").update(forgotToken).digest("hex");

        this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
        //step 2 - return values to user

        return forgotToken;
    },

    verifySignupVerificationCode: function (verificationCode: string) {
        const hashedCode = crypto.createHash("sha256").update(verificationCode).digest("hex");
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
    passwordChangedAfter: function (jwtTimeStamp: number) {
        console.log(this.pass_changed_at);
        if (this.pass_changed_at) {
            const changedTimeStamp = Math.floor(this.pass_changed_at.getTime() / 1000);
            return jwtTimeStamp < changedTimeStamp;
        }
        return false;
    },
};

userSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email });
};
userSchema.statics.findByUsername = function (username: string) {
    return this.findOne({ username });
};

export default mongoose.model<IUserDocument, IUserModel>("User", userSchema);
