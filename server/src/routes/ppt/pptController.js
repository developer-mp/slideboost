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
const storageService_1 = __importDefault(require("../../services/storage/storageService"));
const handleError_1 = __importDefault(require("../../utils/common/handleError"));
const env_config_1 = require("../../../env.config");
const aiService_1 = __importDefault(require("../../services/ai/aiService"));
const pptService_1 = __importDefault(require("../../services/ppt/pptService"));
const clearUploadFolder_1 = require("../../utils/storage/clearUploadFolder");
const pool_1 = require("../../db/config/pool");
const tokenDataStore = {};
const pptController = {
    calculateTokens: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.query.userId;
        const files = req.query.files;
        if (!files) {
            res.status(400).json({ message: "File is required" });
            return;
        }
        const transcript = yield pptService_1.default.generateTranscript(files);
        const tokenCount = Math.ceil(transcript.length / 4);
        tokenDataStore[userId] = transcript;
        res.status(200).json({
            message: "Token count calculated successfully",
            tokenCount,
            tokenPerCredit: env_config_1.config.TOKENS_PER_CREDIT,
            tokenLimit: env_config_1.config.AI_MAX_TOKENS,
        });
    }),
    createPresentation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.query.userId;
        const templateId = req.query.templateId;
        const title = req.query.title;
        const credits = parseFloat(req.query.credits);
        if (!templateId) {
            res.status(400).json({ message: "Template ID is required" });
            return;
        }
        if (!title) {
            res.status(400).json({ message: "Title is required" });
            return;
        }
        try {
            const transcript = tokenDataStore[userId];
            if (!transcript) {
                res.status(400).json({
                    message: "Transcript not found",
                });
                return;
            }
            const template = yield storageService_1.default.downloadFile(templateId, "arraybuffer");
            const typedTemplate = template;
            const contentString = yield aiService_1.default.callAi(env_config_1.config.PROMPT_STRING, transcript);
            const content = JSON.parse(contentString);
            const pptPath = yield pptService_1.default.createPpt(typedTemplate, content, title);
            yield pptService_1.default.uploadPptToStorage(userId, pptPath);
            yield (0, clearUploadFolder_1.clearUploadFolder)();
            (yield pool_1.pool.query("INSERT INTO credits (balance, user_id) SELECT balance - $1, $2 FROM credits WHERE user_id = $2 ORDER BY transaction_date DESC LIMIT 1", [credits, userId]));
            res.status(200).json({
                message: "Presentation created successfully",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "creating the presentation");
            return;
        }
    }),
};
exports.default = pptController;
