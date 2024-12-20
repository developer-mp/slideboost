import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";
import { config } from "../../../env.config";
import handleError from "../../utils/handleError";

const smtp = {
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: false,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transporter = nodemailer.createTransport(smtp);

const userService = {
  async createVerificationEmail(
    email: string,
    verificationCode: string,
    template: string,
    subject: string
  ): Promise<void> {
    try {
      const html = pug.renderFile(`./src/templates/${template}.pug`, {
        subject,
        verificationCode,
      });

      const mailOptions = {
        from: config.SMTP_EMAIL_FROM,
        to: email,
        subject,
        text: convert(html),
        html,
      };

      await transporter.sendMail(mailOptions);
    } catch (error: unknown) {
      handleError.serviceError(error, "processing the nodemailer transporter");
      return;
    }
  },
  sendVerificationEmail(email: string, verificationCode: string) {
    this.createVerificationEmail(
      email,
      verificationCode,
      "verificationEmail",
      "Email Verification"
    );
  },
};

export default userService;
