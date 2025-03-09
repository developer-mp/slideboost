"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeFileExtension = void 0;
const path_1 = __importDefault(require("path"));
const changeFileExtension = (filePath, newExtension) => {
    const parsedPath = path_1.default.parse(filePath);
    const newFilePath = path_1.default.format({
        dir: parsedPath.dir,
        name: parsedPath.name,
        ext: newExtension,
    });
    return newFilePath;
};
exports.changeFileExtension = changeFileExtension;
