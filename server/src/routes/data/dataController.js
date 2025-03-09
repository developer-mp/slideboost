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
const handleError_1 = __importDefault(require("../../utils/common/handleError"));
const pool_1 = require("../../db/config/pool");
const dataController = {
    getTemplateCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const templateCategories = (yield pool_1.pool.query("SELECT * FROM template_categories"));
            res.status(200).json({
                data: templateCategories.rows,
                message: "Template categories fetched successfully",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "getting the template categories");
            return;
        }
    }),
    getDeactivationReasons: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deactivationReasons = (yield pool_1.pool.query("SELECT * FROM deactivation_reasons"));
            res.status(200).json({
                data: deactivationReasons.rows,
                message: "Deactivation reasons fetched successfully",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "getting the deactivation reasons");
            return;
        }
    }),
    getSupportedFiles: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const files = (yield pool_1.pool.query("SELECT * FROM supported_files"));
            res.status(200).json({
                data: files.rows,
                message: "Supported files fetched successfully",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "getting the supported files");
            return;
        }
    }),
    getFaq: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const faq = (yield pool_1.pool.query("SELECT * FROM faq"));
            res.status(200).json({
                data: faq.rows,
                message: "FAQ fetched successfully",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "getting the FAQ");
            return;
        }
    }),
    getNews: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const news = (yield pool_1.pool.query("SELECT * FROM news"));
            res.status(200).json({
                data: news.rows,
                message: "News fetched successfully",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "getting the news");
            return;
        }
    }),
};
exports.default = dataController;
