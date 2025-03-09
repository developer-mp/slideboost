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
exports.convertPptToPng = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const getUploadDir_1 = require("../common/getUploadDir");
const clearUploadFolder_1 = require("../storage/clearUploadFolder");
const uploadDir = (0, getUploadDir_1.getUploadDir)();
const convertPptToPng = (pptBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    const tempPptFilePath = path_1.default.join(uploadDir, "temp.pptx");
    fs_1.default.writeFileSync(tempPptFilePath, pptBuffer);
    const command = "soffice";
    const args = [
        "--headless",
        "--convert-to",
        "png",
        "--outdir",
        uploadDir,
        tempPptFilePath,
    ];
    const sofficeProcess = (0, child_process_1.spawn)(command, args);
    let errorData = [];
    return new Promise((resolve, reject) => {
        sofficeProcess.stderr.on("data", (data) => {
            errorData.push(data);
        });
        sofficeProcess.on("close", (code) => __awaiter(void 0, void 0, void 0, function* () {
            fs_1.default.unlinkSync(tempPptFilePath);
            if (code !== 0) {
                reject(`Error converting PPT to PNG: ${Buffer.concat(errorData).toString()}`);
                return;
            }
            const outputPngPath = path_1.default.join(uploadDir, "temp.png");
            if (fs_1.default.existsSync(outputPngPath)) {
                const pngBuffer = fs_1.default.readFileSync(outputPngPath);
                resolve(pngBuffer);
            }
            else {
                reject("Error creating PNG file");
            }
            yield (0, clearUploadFolder_1.clearUploadFolder)();
        }));
    });
});
exports.convertPptToPng = convertPptToPng;
