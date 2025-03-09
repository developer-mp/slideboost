"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.b2 = void 0;
const backblaze_b2_1 = __importDefault(require("backblaze-b2"));
const env_config_1 = require("../../../env.config");
exports.b2 = new backblaze_b2_1.default({
    applicationKeyId: env_config_1.config.STORAGE_KEY_ID,
    applicationKey: env_config_1.config.STORAGE_APP_KEY,
});
