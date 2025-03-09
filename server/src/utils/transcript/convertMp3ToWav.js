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
exports.convertMp3ToWav = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getUploadDir_1 = require("../common/getUploadDir");
const uploadDir = (0, getUploadDir_1.getUploadDir)();
const convertMp3ToWav = (mp3Buffer) => __awaiter(void 0, void 0, void 0, function* () {
    const tempMp3Path = path_1.default.join(uploadDir, "temp_audio.mp3");
    const tempWavPath = path_1.default.join(uploadDir, "temp_audio.wav");
    fs_1.default.writeFileSync(tempMp3Path, mp3Buffer);
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`ffmpeg -i ${tempMp3Path} ${tempWavPath}`, (err, stdout, stderr) => {
            if (err) {
                reject(new Error("Error converting MP3 to WAV"));
            }
            else {
                const wavBuffer = fs_1.default.readFileSync(tempWavPath);
                fs_1.default.unlinkSync(tempMp3Path);
                fs_1.default.unlinkSync(tempWavPath);
                resolve(wavBuffer);
            }
        });
    });
});
exports.convertMp3ToWav = convertMp3ToWav;
