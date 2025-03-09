"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const storageController_1 = __importDefault(require("./storageController"));
const createMemoryStorage_1 = __importDefault(require("../../utils/storage/createMemoryStorage"));
const storageRouter = express_1.default.Router();
storageRouter.post("/upload", createMemoryStorage_1.default.single("file"), storageController_1.default.uploadFileToStorage);
storageRouter.get("/metadata", storageController_1.default.getFileMetadata);
storageRouter.post("/delete", storageController_1.default.deleteFileFromStorage);
storageRouter.get("/download", storageController_1.default.downloadFileFromStorage);
exports.default = storageRouter;
