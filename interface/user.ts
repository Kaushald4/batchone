import mongoose, { Document, Model } from "mongoose";

interface IProfilePhoto {
    imageId: string;
    imageUrl: string;
}
interface IAddress {
    state: string;
    city: string;
    pincode: string;
    addressLineOne: string;
    addressLineTwo: string;
}

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: string;
    profilePhoto: IProfilePhoto;
    coverPhoto: IProfilePhoto;
    phoneNo: string;
    passChangedAt: Date | undefined;
    forgotPasswordToken: string | undefined;
    forgotPasswordExpire: number | undefined;
    isVerified: boolean;
    isNewUser: boolean;
    dob: Date;
    verificationCode: string;
    verificationCodeExpire: Date;
    address: IAddress;
    lastLoginAt: Date;
    loginCount: string;
}

export interface IUserDocument extends IUser, Document {
    comparePassword: (password: string) => Promise<boolean>;
    getJwtToken: () => string;
    generateForgotPasswordToken: () => Promise<string>;
    passwordChangedAfter: (jwtTimeStamp: number) => boolean;
    verifySignupVerificationCode: (code: string) => boolean;
}

export interface IUserModel extends Model<IUserDocument> {
    findByEmail: (email: string) => Promise<IUserDocument>;
    findByUsername: (username: string) => Promise<IUserDocument>;
}
