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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const nodejs_pptx_1 = __importDefault(require("nodejs-pptx"));
const handleError_1 = __importDefault(require("../../utils/common/handleError"));
const pptx_automizer_1 = __importDefault(require("pptx-automizer"));
const pool_1 = require("../../db/config/pool");
const storageService_1 = __importDefault(require("../storage/storageService"));
const env_config_1 = require("../../../env.config");
const getUploadDir_1 = require("../../utils/common/getUploadDir");
const transcriptService_1 = __importDefault(require("../transcript/transcriptService"));
const clearUploadFolder_1 = require("../../utils/storage/clearUploadFolder");
const uploadDir = (0, getUploadDir_1.getUploadDir)();
const pptService = {
    createUploadFolder: (template) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const inputFileName = "layout.pptx";
            const inputFilePath = path_1.default.join(uploadDir, inputFileName);
            const bufferTemplate = Buffer.from(template);
            yield fs_1.default.promises.writeFile(inputFilePath, bufferTemplate);
            return inputFilePath;
        }
        catch (error) {
            handleError_1.default.serviceError(error, "creating upload folder");
            return "";
        }
    }),
    createTitleSlide: (title, filePath) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let pptx = new nodejs_pptx_1.default.Composer();
            yield pptx.load(filePath);
            yield pptx.compose((pres) => __awaiter(void 0, void 0, void 0, function* () {
                let slide = yield pres.getSlide("slide1");
                slide.addText((text) => {
                    text
                        .value(title)
                        .x(220)
                        .y(150)
                        .fontSize(28)
                        .fontFace("Arial")
                        .textColor("000000")
                        .textWrap("none")
                        .margin(0)
                        .textAlign("center");
                });
            }));
            const outputFileName = "slide1.pptx";
            const outputFilePath = path_1.default.join(uploadDir, outputFileName);
            yield pptx.save(outputFilePath);
        }
        catch (error) {
            handleError_1.default.serviceError(error, "creating title slide");
            return;
        }
    }),
    createContentSlide: (entry, filePath, slideNum) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let pptx = new nodejs_pptx_1.default.Composer();
            yield pptx.load(filePath);
            yield pptx.compose((pres) => __awaiter(void 0, void 0, void 0, function* () {
                pres.layout("LAYOUT_WIDE");
                let slide = yield pres.getSlide("slide1");
                slide.addText((text) => {
                    text
                        .value(entry.header)
                        .x(20)
                        .y(30)
                        .fontSize(24)
                        .fontFace("Arial")
                        .textColor("000000")
                        .margin(0)
                        .textWrap("none");
                });
                entry.text.forEach((item, index) => {
                    slide.addText((text) => {
                        text
                            .value(`• ${item.statement}`)
                            .x(20)
                            .y(130 + index * 60)
                            .fontSize(16)
                            .fontFace("Arial")
                            .textColor("000000")
                            .margin(0)
                            .textWrap("none");
                    });
                });
            }));
            const outputFileName = `slide${slideNum}.pptx`;
            const outputFilePath = path_1.default.join(uploadDir, outputFileName);
            yield pptx.save(outputFilePath);
        }
        catch (error) {
            handleError_1.default.serviceError(error, "creating content slide");
            return;
        }
    }),
    mergeSlides: (slides) => __awaiter(void 0, void 0, void 0, function* () {
        const automizer = new pptx_automizer_1.default({
            templateDir: uploadDir,
            outputDir: uploadDir,
        });
        function buildPresentation(templates) {
            let presentation = automizer.loadRoot(templates[0]);
            if (templates.length > 1) {
                for (let i = 1; i < templates.length; i++) {
                    presentation.load(templates[i], `template-${i}`);
                }
            }
            return presentation;
        }
        function addSlides(files, pres) {
            return __awaiter(this, void 0, void 0, function* () {
                for (let i = 1; i < files.length; i++) {
                    const slideNumbers = yield pres
                        .getTemplate(`template-${i}`)
                        .getAllSlideNumbers();
                    slideNumbers.forEach((slideNumber) => {
                        pres.addSlide(`template-${i}`, slideNumber);
                    });
                }
            });
        }
        function execute() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let pres = buildPresentation(slides);
                    yield addSlides(slides, pres);
                    const zipfile = yield pres.getJSZip();
                    const bufferfile = yield zipfile.generateAsync({ type: "nodebuffer" });
                    const outputFile = path_1.default.join(uploadDir, "presentation.pptx");
                    yield fs_1.default.promises.writeFile(outputFile, bufferfile);
                    return outputFile;
                }
                catch (error) {
                    handleError_1.default.serviceError(error, "merging slides");
                    return "";
                }
            });
        }
        return yield execute();
    }),
    createPpt: (template, content, title) => __awaiter(void 0, void 0, void 0, function* () {
        if (!template) {
            throw new Error("Template not found");
        }
        if (!content) {
            throw new Error("Content not found");
        }
        if (!title) {
            throw new Error("Title not found");
        }
        const templatePath = yield pptService.createUploadFolder(template);
        if (!templatePath) {
            throw new Error("Template path not found");
        }
        try {
            yield pptService.createTitleSlide(title, templatePath);
            const slideNames = ["slide1.pptx"];
            for (let i = 0; i < content.slides.length; i++) {
                const slideContent = content.slides[i];
                const slideNum = i + 2;
                const slideFileName = `slide${slideNum}.pptx`;
                yield pptService.createContentSlide(slideContent, templatePath, slideNum);
                slideNames.push(slideFileName);
            }
            const pptPath = yield pptService.mergeSlides(slideNames);
            return pptPath;
        }
        catch (error) {
            handleError_1.default.serviceError(error, "creating presentation");
            return "";
        }
    }),
    uploadPptToStorage: (userId, pptFilePath) => __awaiter(void 0, void 0, void 0, function* () {
        if (!pptFilePath) {
            throw new Error("No file found");
        }
        if (!userId) {
            throw new Error("User ID is required");
        }
        const folder = "projects";
        const fileBuffer = fs_1.default.readFileSync(pptFilePath);
        try {
            const fileName = `presentation_${new Date().toISOString()}.pptx`;
            const filePath = `${userId}/${folder}/${fileName}`;
            const fileType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            const category = null;
            const response = yield storageService_1.default.uploadFile(fileBuffer, filePath, env_config_1.config.STORAGE_BUCKET_ID);
            if (!response) {
                throw new Error("Failed to upload the file to the storage");
            }
            const fileId = response.fileId;
            const storageFileName = response.fileName;
            const fileUrl = `https://${env_config_1.config.STORAGE_BUCKET_NAME}.${env_config_1.config.STORAGE_ENDPOINT}/${filePath}`;
            const uploadedAt = new Date();
            const fileSize = fileBuffer.length;
            (yield pool_1.pool.query("INSERT INTO files(name, file_path, type, size, folder, template_category, file_id, file_url, uploaded_at, user_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [
                fileName,
                storageFileName,
                fileType,
                fileSize,
                folder,
                category,
                fileId,
                fileUrl,
                uploadedAt,
                userId,
            ]));
        }
        catch (error) {
            handleError_1.default.serviceError(error, "uploading the presentation to the storage");
            return;
        }
    }),
    generateTranscript: (files) => __awaiter(void 0, void 0, void 0, function* () {
        if (!files) {
            throw new Error("File is required");
        }
        try {
            let extractedText = "";
            const textFormats = ["text"];
            for (const file of files) {
                const { file_id, file_type } = file;
                const fileType = file_type.split("/")[0].toLowerCase();
                const fileFormat = file_type.split("/")[1].toLowerCase();
                const format = textFormats.includes(fileType) ? "text" : "arraybuffer";
                let transcript = "";
                if (format === "text") {
                    transcript = yield storageService_1.default.downloadFile(file_id, format);
                }
                else {
                    const buffer = (yield storageService_1.default.downloadFile(file_id, format));
                    if (fileType == "image") {
                        transcript = yield transcriptService_1.default.convertImageToText(buffer);
                    }
                    else if (fileType == "audio") {
                        transcript = yield transcriptService_1.default.convertAudioToText(buffer);
                    }
                    else if (fileType == "video") {
                        transcript = yield transcriptService_1.default.convertVideoToText(buffer);
                    }
                    else if (fileType == "application") {
                        if (fileFormat ==
                            "vnd.openxmlformats-officedocument.wordprocessingml.document") {
                            transcript = yield transcriptService_1.default.convertDocsToText(buffer);
                        }
                        else if (fileFormat == "pdf") {
                            transcript = yield transcriptService_1.default.convertPdfToText(buffer);
                        }
                    }
                }
                extractedText += transcript;
            }
            yield (0, clearUploadFolder_1.clearUploadFolder)();
            return extractedText;
        }
        catch (error) {
            handleError_1.default.serviceError(error, "generating the transcript");
            return "";
        }
    }),
};
exports.default = pptService;
