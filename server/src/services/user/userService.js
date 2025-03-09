"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const pug_1 = __importDefault(require("pug"));
const html_to_text_1 = require("html-to-text");
const env_config_1 = require("../../../env.config");
const handleError_1 = __importDefault(require("../../utils/common/handleError"));
const convertImgToBase64_1 = require("../../utils/conversion/convertImgToBase64");
const smtp = {
    host: env_config_1.config.SMTP_HOST,
    port: env_config_1.config.SMTP_PORT,
    secure: false,
    auth: {
        user: env_config_1.config.SMTP_USER,
        pass: env_config_1.config.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
};
const transporter = nodemailer_1.default.createTransport(smtp);
const userService = {
    createEmail(email, name, expirationTime, credits, verificationCode, template, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageBase64String = (0, convertImgToBase64_1.convertImgToBase64)("./public/images/logo_text.png");
                const imageBase64 = "data:image/png;base64," + imageBase64String;
                const html = pug_1.default.renderFile(`./src/templates/${template}.pug`, {
                    name,
                    expirationTime: expirationTime || null,
                    credits: credits || null,
                    template,
                    subject,
                    verificationCode: verificationCode || null,
                    imageBase64,
                });
                const mailOptions = {
                    from: env_config_1.config.SMTP_EMAIL_FROM,
                    to: email,
                    subject,
                    text: (0, html_to_text_1.convert)(html),
                    html,
                };
                yield transporter.sendMail(mailOptions);
            }
            catch (error) {
                handleError_1.default.serviceError(error, "processing the nodemailer transporter");
                return;
            }
        });
    },
    sendEmail(email, name, expirationTime, credits, verificationCode, template, subject) {
        this.createEmail(email, name, expirationTime, credits, verificationCode, template, subject);
    },
};
exports.default = userService;
