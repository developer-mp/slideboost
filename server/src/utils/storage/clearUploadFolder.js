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
exports.clearUploadFolder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handleError_1 = __importDefault(require("../common/handleError"));
const getUploadDir_1 = require("../common/getUploadDir");
const uploadDir = (0, getUploadDir_1.getUploadDir)();
const clearUploadFolder = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield fs_1.default.promises.readdir(uploadDir);
        for (const file of files) {
            const filePath = path_1.default.join(uploadDir, file);
            yield fs_1.default.promises.unlink(filePath);
        }
    }
    catch (err) {
        handleError_1.default.serviceError(err, "clearing upload folder");
    }
});
exports.clearUploadFolder = clearUploadFolder;
