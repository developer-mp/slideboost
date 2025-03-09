"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerRouter = void 0;
const userRouter_1 = __importDefault(require("./user/userRouter"));
const storageRouter_1 = __importDefault(require("./storage/storageRouter"));
const dataRouter_1 = __importDefault(require("./data/dataRouter"));
const pptRouter_1 = __importDefault(require("./ppt/pptRouter"));
const paymentRouter_1 = __importDefault(require("./payment/paymentRouter"));
exports.ServerRouter = {
    setRouter(app) {
        const apiVersion = "v1";
        app.use(`/api/${apiVersion}/user`, userRouter_1.default);
        app.use(`/api/${apiVersion}/storage`, storageRouter_1.default);
        app.use(`/api/${apiVersion}/data`, dataRouter_1.default);
        app.use(`/api/${apiVersion}/ppt`, pptRouter_1.default);
        app.use(`/api/${apiVersion}/payment`, paymentRouter_1.default);
    },
};
