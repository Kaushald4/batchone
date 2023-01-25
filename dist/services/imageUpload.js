"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.s3FileUpload = void 0;
const s3_config_1 = __importDefault(require("../config/s3.config"));
const s3FileUpload = async ({ bucketName, key, body, contentType }) => {
    return await s3_config_1.default
        .upload({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
    })
        .promise();
};
exports.s3FileUpload = s3FileUpload;
const deleteFile = async ({ bucketName, key }) => {
    return await s3_config_1.default
        .deleteObject({
        Bucket: bucketName,
        Key: key,
    })
        .promise();
};
exports.deleteFile = deleteFile;
