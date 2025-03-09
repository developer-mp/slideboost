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
exports.extractAudioFromVideo = void 0;
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const getUploadDir_1 = require("../common/getUploadDir");
const uploadDir = (0, getUploadDir_1.getUploadDir)();
const extractAudioFromVideo = (videoBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    const tempVideoPath = path_1.default.join(uploadDir, "temp_video.mp4");
    const tempAudioPath = path_1.default.join(uploadDir, "temp_audio.wav");
    fs_1.default.writeFileSync(tempVideoPath, videoBuffer);
    yield new Promise((resolve, reject) => {
        const ffmpegProcess = (0, child_process_1.spawn)("ffmpeg", [
            "-i",
            tempVideoPath,
            "-vn",
            "-acodec",
            "pcm_s16le",
            "-ar",
            "16000",
            "-ac",
            "1",
            tempAudioPath,
        ]);
        ffmpegProcess.on("close", (code) => {
            if (code !== 0) {
                reject(new Error("FFmpeg audio extraction failed"));
            }
            else {
                resolve();
            }
        });
        ffmpegProcess.on("error", (err) => {
            reject(err);
        });
    });
    const audioBuffer = fs_1.default.readFileSync(tempAudioPath);
    fs_1.default.unlinkSync(tempVideoPath);
    fs_1.default.unlinkSync(tempAudioPath);
    return audioBuffer;
});
exports.extractAudioFromVideo = extractAudioFromVideo;
