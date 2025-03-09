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
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const convertMp3ToWav_1 = require("../../utils/transcript/convertMp3ToWav");
const extractAudioFromVideo_1 = require("../../utils/transcript/extractAudioFromVideo");
// import { downloadVideoFromYoutube } from "../../utils/transcript/downloadVideoFromYoutube";
const handleError_1 = __importDefault(require("../../utils/common/handleError"));
const getUploadDir_1 = require("../../utils/common/getUploadDir");
const mammoth_1 = __importDefault(require("mammoth"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const uploadDir = (0, getUploadDir_1.getUploadDir)();
const transcriptService = {
    convertImageToText: (buffer) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield tesseract_js_1.default.recognize(buffer, "eng");
            return result.data.text;
        }
        catch (error) {
            handleError_1.default.serviceError(error, "processing the image file");
            return "";
        }
    }),
    convertAudioToText: (buffer) => __awaiter(void 0, void 0, void 0, function* () {
        const isMp3 = (buffer) => {
            const id3Tag = buffer.subarray(0, 3).toString("utf8");
            if (id3Tag === "ID3") {
                return true;
            }
            return buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
        };
        const isWav = (buffer) => {
            return buffer.subarray(0, 4).toString("utf8") === "RIFF";
        };
        try {
            let wavBuffer = buffer;
            if (isMp3(buffer)) {
                wavBuffer = yield (0, convertMp3ToWav_1.convertMp3ToWav)(buffer);
            }
            else if (isWav(buffer)) {
                wavBuffer = buffer;
            }
            else {
                throw new Error("Unsupported audio format");
            }
            const wavFilePath = path_1.default.join(uploadDir, "temp_audio.wav");
            fs_1.default.writeFileSync(wavFilePath, wavBuffer);
            const scriptPath = path_1.default.join(__dirname, "audioToText.py");
            const pythonProcess = (0, child_process_1.spawn)("python", [scriptPath, wavFilePath]);
            let scriptOutput = "";
            pythonProcess.stdout.on("data", (data) => {
                scriptOutput += data.toString();
            });
            pythonProcess.stderr.on("data", (data) => {
                console.error("Python script stderr:", data.toString());
            });
            return new Promise((resolve, reject) => {
                pythonProcess.on("close", (code) => {
                    fs_1.default.unlinkSync(wavFilePath);
                    if (code !== 0) {
                        reject(new Error("Python processing error"));
                    }
                    else {
                        resolve(scriptOutput.trim());
                    }
                });
            });
        }
        catch (error) {
            handleError_1.default.serviceError(error, "processing the audio file");
            return "";
        }
    }),
    convertVideoToText: (buffer) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const audioBuffer = yield (0, extractAudioFromVideo_1.extractAudioFromVideo)(buffer);
            const wavBuffer = audioBuffer;
            const wavFilePath = path_1.default.join(uploadDir, "temp_audio.wav");
            fs_1.default.writeFileSync(wavFilePath, wavBuffer);
            const scriptPath = path_1.default.join(__dirname, "audioToText.py");
            const pythonProcess = (0, child_process_1.spawn)("python", [scriptPath, wavFilePath]);
            let scriptOutput = "";
            pythonProcess.stdout.on("data", (data) => {
                scriptOutput += data.toString();
            });
            pythonProcess.stderr.on("data", (data) => {
                console.error("Python script stderr:", data.toString());
            });
            return new Promise((resolve, reject) => {
                pythonProcess.on("close", (code) => {
                    fs_1.default.unlinkSync(wavFilePath);
                    if (code !== 0) {
                        reject(new Error("Python processing error"));
                    }
                    else {
                        resolve(scriptOutput.trim());
                    }
                });
            });
        }
        catch (error) {
            handleError_1.default.serviceError(error, "processing the video file");
            return "";
        }
    }),
    convertDocsToText: (buffer) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield mammoth_1.default.extractRawText({ buffer });
            return data.value;
        }
        catch (error) {
            handleError_1.default.serviceError(error, "processing the DOCX file");
            return "";
        }
    }),
    convertPdfToText: (buffer) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield (0, pdf_parse_1.default)(buffer);
            return data.text;
        }
        catch (error) {
            handleError_1.default.serviceError(error, "processing the PDF file");
            return "";
        }
    }),
    // convertYoutubeToText: async (req: Request, res: Response): Promise<void> => {
    //   const { filePath } = req.body;
    //   try {
    //     if (!filePath) {
    //       res.status(400).json({ message: "YouTube URL is required" });
    //       return;
    //     }
    //     const videoFilePath = await downloadVideoFromYoutube(filePath);
    //     const wavFilePath = videoFilePath.replace(
    //       path.extname(videoFilePath),
    //       ".wav"
    //     );
    //     await extractWavFromVideo(videoFilePath, wavFilePath);
    //     const scriptPath = path.join(uploadDir, "audioToText.py");
    //     const pythonProcess = spawn("python", [scriptPath, wavFilePath]);
    //     let scriptOutput = "";
    //     pythonProcess.stdout.on("data", (data) => {
    //       scriptOutput += data.toString();
    //     });
    //     pythonProcess.stderr.on("data", (data) => {
    //       console.error("Python script stderr:", data.toString());
    //     });
    //     pythonProcess.on("close", (code) => {
    //       fs.unlinkSync(wavFilePath);
    //       if (code !== 0) {
    //         res.status(500).json({ message: "Python processing error" });
    //       } else {
    //         res.json({ text: scriptOutput.trim() });
    //       }
    //     });
    //   } catch (error: unknown) {
    //     handleError.serviceError(error, "processing the Youtube video");
    //     return;
    //   }
    // },
};
exports.default = transcriptService;
