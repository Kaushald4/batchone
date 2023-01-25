"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transporter_config_1 = __importDefault(require("../config/transporter.config"));
const index_1 = __importDefault(require("../config/index"));
const mailHelper = async (options) => {
    const message = {
        from: index_1.default.SMTP_MAIL_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.text, // plain text body
        // html: "<b>Hello world?</b>", // html body
    };
    await transporter_config_1.default.sendMail(message);
};
exports.default = mailHelper;
