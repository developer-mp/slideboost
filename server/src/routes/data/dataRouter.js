"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataController_1 = __importDefault(require("./dataController"));
const dataRouter = express_1.default.Router();
dataRouter.get("/template-categories", dataController_1.default.getTemplateCategories);
dataRouter.get("/deactivation-reasons", dataController_1.default.getDeactivationReasons);
dataRouter.get("/supported-files", dataController_1.default.getSupportedFiles);
dataRouter.get("/faq", dataController_1.default.getFaq);
dataRouter.get("/news", dataController_1.default.getNews);
exports.default = dataRouter;
