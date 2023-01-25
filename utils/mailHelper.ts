import transporter from "../config/transporter.config";
import config from "../config/index";

interface Props {
    email: string;
    subject: string;
    text: string;
}

const mailHelper = async (options: Props) => {
    const message = {
        from: config.SMTP_MAIL_EMAIL, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.text, // plain text body
        // html: "<b>Hello world?</b>", // html body
    };

    await transporter.sendMail(message);
};

export default mailHelper;
