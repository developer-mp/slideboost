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
const env_config_1 = require("../../../env.config");
const handleError_1 = __importDefault(require("../../utils/common/handleError"));
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: env_config_1.config.AI_API_KEY,
});
const aiService = {
    callAi(prompt, transcript) {
        return __awaiter(this, void 0, void 0, function* () {
            const formattedPrompt = prompt.replace("[transcript]", transcript);
            try {
                const completion = yield openai.chat.completions.create({
                    model: env_config_1.config.AI_MODEL,
                    messages: [{ role: "user", content: formattedPrompt }],
                    temperature: env_config_1.config.AI_TEMPERATURE,
                    max_tokens: env_config_1.config.AI_MAX_TOKENS,
                });
                const response = completion.choices[0].message.content;
                if (!response) {
                    throw new Error("Received empty response from AI");
                }
                return response;
            }
            catch (error) {
                handleError_1.default.serviceError(error, "processing AI request");
                throw error;
            }
        });
    },
};
exports.default = aiService;
