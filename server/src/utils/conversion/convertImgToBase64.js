"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertImgToBase64 = void 0;
const fs_1 = __importDefault(require("fs"));
const convertImgToBase64 = (imagePath) => {
    const imageBuffer = fs_1.default.readFileSync(imagePath);
    return imageBuffer.toString("base64");
};
exports.convertImgToBase64 = convertImgToBase64;
