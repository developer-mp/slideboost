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
const storage_1 = require("../../storage/config/storage");
const handleError_1 = __importDefault(require("../../utils/common/handleError"));
const apiService_1 = __importDefault(require("../api/apiService"));
const storageService = {
    authorizeStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield storage_1.b2.authorize();
                if (!response.data.authorizationToken) {
                    throw new Error("Failed to authenticate with the storage");
                }
                return response.data;
            }
            catch (error) {
                handleError_1.default.serviceError(error, "authorizing with the storage");
                return;
            }
        });
    },
    getUploadUrl(bucketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield storage_1.b2.getUploadUrl({
                    bucketId: bucketId,
                });
                if (!response.data.uploadUrl) {
                    throw new Error("Failed to get the upload URL from the storage");
                }
                return response.data;
            }
            catch (error) {
                handleError_1.default.serviceError(error, "getting the storage upload URL");
                return;
            }
        });
    },
    uploadFile(fileBuffer, fileName, bucketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authData = yield this.authorizeStorage();
                if (!authData)
                    return;
                const uploadData = yield this.getUploadUrl(bucketId);
                if (!uploadData) {
                    return;
                }
                const { uploadUrl, authorizationToken } = uploadData;
                if (!uploadUrl || !authorizationToken)
                    return;
                const response = yield storage_1.b2.uploadFile({
                    uploadUrl: uploadUrl,
                    uploadAuthToken: authorizationToken,
                    fileName: fileName,
                    data: fileBuffer,
                });
                if (!response.data.fileId) {
                    throw new Error("Failed to upload the file to the storage");
                }
                return {
                    fileId: response.data.fileId,
                    fileName: response.data.fileName,
                };
            }
            catch (error) {
                handleError_1.default.serviceError(error, "uploading the file to the storage");
                return;
            }
        });
    },
    downloadFile(fileId, responseType) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = `${env_config_1.config.STORAGE_API_URL}${env_config_1.config.STORAGE_DOWNLOAD_FILE_BY_ID}`;
            try {
                const authData = yield this.authorizeStorage();
                if (!authData)
                    return {};
                const headers = {
                    Authorization: authData.authorizationToken,
                };
                const data = { fileId };
                const response = yield apiService_1.default.getCall(endpoint, data, headers, responseType);
                return response;
            }
            catch (error) {
                handleError_1.default.serviceError(error, "downloading the file from the storage");
                return {};
            }
        });
    },
    deleteFile(fileId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = `${env_config_1.config.STORAGE_API_URL}${env_config_1.config.STORAGE_DELETE_URL}`;
            try {
                const authData = yield this.authorizeStorage();
                if (!authData)
                    return;
                const data = { fileName, fileId };
                const headers = {
                    Authorization: authData.authorizationToken,
                };
                yield apiService_1.default.postCall(endpoint, data, headers);
            }
            catch (error) {
                handleError_1.default.serviceError(error, "deleting the file from the storage");
                return;
            }
        });
    },
};
exports.default = storageService;
