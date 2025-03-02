import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";
import { convertImgToBase64 } from "../../utils/conversion/convertImgToBase64";

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
  async createEmail(
    email: string,
    name: string,
    expirationTime: number | undefined,
    verificationCode: string | undefined,
    template: string,
    subject: string
  ): Promise<void> {
    try {
      const imageBase64String = convertImgToBase64(
        "./public/images/logo_text.png"
      );
      const imageBase64 = "data:image/png;base64," + imageBase64String;

      const html = pug.renderFile(`./src/templates/${template}.pug`, {
        name,
        expirationTime: expirationTime || null,
        template,
        subject,
        verificationCode: verificationCode || null,
        imageBase64,
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
  sendEmail(
    email: string,
    name: string,
    expirationTime: number | undefined,
    verificationCode: string | undefined,
    template: string,
    subject: string
  ) {
    this.createEmail(
      email,
      name,
      expirationTime,
      verificationCode,
      template,
      subject
    );
  },
};

export default userService;
