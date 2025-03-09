"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTextFile = void 0;
const fs_1 = __importDefault(require("fs"));
const readTextFile = (filePath) => {
    try {
        const fileContent = fs_1.default.readFileSync(filePath, "utf-8");
        return fileContent;
    }
    catch (error) {
        throw new Error("Error reading the text file");
    }
};
exports.readTextFile = readTextFile;
