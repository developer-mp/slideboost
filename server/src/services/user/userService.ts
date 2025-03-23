import path from "path";
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
    emailFrom: string,
    emailTo: string,
    name: string,
    expirationTime: number | undefined,
    credits: number | undefined,
    verificationCode: string | undefined,
    template: string,
    subject: string,
    message: string | undefined
  ): Promise<void> {
    try {
      const imagePath = config.IMG_FOLDER + "/logo_text.png";
      const imageBase64String = convertImgToBase64(imagePath);
      const imageBase64 = "data:image/png;base64," + imageBase64String;

      const html = pug.renderFile(`./src/templates/${template}.pug`, {
        emailFrom,
        name,
        expirationTime: expirationTime || null,
        credits: credits || null,
        template,
        subject,
        verificationCode: verificationCode || null,
        message: message || null,
        imageBase64,
      });

      const mailOptions = {
        from: emailFrom,
        to: emailTo,
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
    emailFrom: string,
    emailTo: string,
    name: string,
    expirationTime: number | undefined,
    credits: number | undefined,
    verificationCode: string | undefined,
    template: string,
    subject: string,
    message: string | undefined
  ) {
    this.createEmail(
      emailFrom,
      emailTo,
      name,
      expirationTime,
      credits,
      verificationCode,
      template,
      subject,
      message
    );
  },
};

export default userService;
