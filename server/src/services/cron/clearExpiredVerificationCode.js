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
const node_cron_1 = __importDefault(require("node-cron"));
const pool_1 = require("../../db/config/pool");
const handleError_1 = __importDefault(require("../../utils/common/handleError"));
const env_config_1 = require("../../../env.config");
// Schedule a job to run every 5 minutes
node_cron_1.default.schedule("*/5 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (yield pool_1.pool.query(`UPDATE users SET verification_code = NULL, code_expires_at = NULL WHERE code_expires_at < NOW() - INTERVAL '${env_config_1.config.VERIFICATION_CODE_EXPIRATION} minutes'`));
    }
    catch (error) {
        handleError_1.default.axiosError(error, "clearing the expired verification code");
        throw error;
    }
}));
