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
const axios_1 = __importDefault(require("axios"));
const handleError_1 = __importDefault(require("../../utils/common/handleError"));
const apiService = {
    postCall: (endpoint, data, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(endpoint, data, {
                headers,
            });
            return response.data;
        }
        catch (error) {
            handleError_1.default.axiosError(error, "making a POST request to the API");
            throw error;
        }
    }),
    getCall: (endpoint, data, headers, responseType) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(endpoint, {
                params: data,
                headers,
                responseType,
            });
            return response.data;
        }
        catch (error) {
            handleError_1.default.axiosError(error, "making a GET request to the API");
            throw error;
        }
    }),
};
exports.default = apiService;
