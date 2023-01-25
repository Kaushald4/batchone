import dotenv from "dotenv";

dotenv.config();

const config = {
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRY: process.env.JWT_EXPIRY || ("30d" as string),
    MONGODB_URL: process.env.MONGODB_URL as string,
    PORT: process.env.PORT as string,
    SMTP_MAIL_HOST: process.env.SMTP_MAIL_HOST as string,
    SMTP_MAIL_PORT: Number(process.env.SMTP_MAIL_PORT) as number,
    SMTP_MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME as string,
    SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD as string,
    SMTP_MAIL_EMAIL: process.env.SMTP_MAIL_EMAIL as string,

    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY as string,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY as string,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME as string,
    S3_REGION: process.env.S3_REGION as string,

    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID as string,
    RAZORPAY_SECRET: process.env.RAZORPAY_SECRET as string,
};

export default config;
