import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import config from "./index";

let transporter = nodemailer.createTransport({
    host: config.SMTP_MAIL_HOST as string,
    port: config.SMTP_MAIL_PORT as number,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.SMTP_MAIL_USERNAME, // generated ethereal user
        pass: config.SMTP_MAIL_PASSWORD, // generated ethereal password
    },
} as SMTPTransport.Options);

export default transporter;
