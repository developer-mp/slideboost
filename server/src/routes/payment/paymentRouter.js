"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = __importDefault(require("./paymentController"));
const paymentRouter = express_1.default.Router();
paymentRouter.post("/checkout", paymentController_1.default.createPaymentLink);
paymentRouter.post("/verify-payment", paymentController_1.default.verifyPayment);
exports.default = paymentRouter;
