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
exports.downloadVideoFromYoutube = void 0;
const path_1 = __importDefault(require("path"));
const youtube_dl_exec_1 = __importDefault(require("youtube-dl-exec"));
const getUploadDir_1 = require("../common/getUploadDir");
const uploadDir = (0, getUploadDir_1.getUploadDir)();
const downloadVideoFromYoutube = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const outputFileName = "downloaded_video.mp4";
        const outputFilePath = path_1.default.join(uploadDir, outputFileName);
        const download = youtube_dl_exec_1.default.exec(filePath, {
            format: "best",
            output: outputFilePath,
            addHeader: ["referer:youtube.com", "user-agent:googlebot"],
        });
        download.on("close", (code) => {
            if (code === 0) {
                resolve(outputFilePath);
            }
            else {
                reject(new Error("Failed to download video"));
            }
        });
        download.on("error", (err) => {
            console.error("Error during download:", err);
            reject(err);
        });
    });
});
exports.downloadVideoFromYoutube = downloadVideoFromYoutube;
