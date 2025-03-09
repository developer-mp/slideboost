"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const handleError = {
    controllerError(res, error, context) {
        if (error instanceof Error) {
            console.error(`An error occurred while ${context}: ${error.message}`);
            res.status(500).json({
                message: error.message,
            });
        }
        else {
            console.error(`An unknown error occurred while ${context}: `, error);
            res.status(500).json({
                message: `An error occurred while ${context}`,
            });
        }
    },
    serviceError(error, context) {
        if (error instanceof Error) {
            console.error(`An error occurred while ${context}: ${error.message}`);
        }
        else {
            console.error(`An unknown error occurred while ${context}: `, error);
        }
        throw new Error(`An error occurred while ${context}`);
    },
    axiosError(error, context) {
        var _a, _b, _c, _d;
        if (axios_1.default.isAxiosError(error)) {
            const errorMessage = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message;
            const requestCode = ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.requestCode) || false;
            console.error(`An error occurred while ${context}: `, errorMessage);
            return { message: errorMessage, requestCode };
        }
        else if (error instanceof Error) {
            console.error(`An unknown error occurred while ${context}: `, error.message);
            return { message: error.message };
        }
        console.error("An unknown error occurred");
        throw new Error("An unknown error occurred");
    },
};
exports.default = handleError;
