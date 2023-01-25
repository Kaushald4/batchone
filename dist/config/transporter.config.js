"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const index_1 = __importDefault(require("./index"));
let transporter = nodemailer_1.default.createTransport({
    host: index_1.default.SMTP_MAIL_HOST,
    port: index_1.default.SMTP_MAIL_PORT,
    secure: false,
    auth: {
        user: index_1.default.SMTP_MAIL_USERNAME,
        pass: index_1.default.SMTP_MAIL_PASSWORD, // generated ethereal password
    },
});
exports.default = transporter;
