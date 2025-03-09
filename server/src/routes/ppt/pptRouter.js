"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pptController_1 = __importDefault(require("./pptController"));
const pptRouter = express_1.default.Router();
pptRouter.get("/count-tokens", pptController_1.default.calculateTokens);
pptRouter.get("/presentation", pptController_1.default.createPresentation);
exports.default = pptRouter;
