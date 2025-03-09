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
const paymentService_1 = __importDefault(require("../../services/payment/paymentService"));
const pool_1 = require("../../db/config/pool");
const userService_1 = __importDefault(require("../../services/user/userService"));
const paymentController = {
    createPaymentLink: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { amount, userId } = req.body;
            const sessionUrl = yield paymentService_1.default.createCheckoutSession(amount, userId);
            if (sessionUrl) {
                res.status(200).json({ url: sessionUrl });
            }
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "creating the payment link");
            return;
        }
    }),
    verifyPayment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { sessionId, credits, userId } = req.body;
        if (!sessionId) {
            res.status(400).json({ message: "Session ID is required" });
            return;
        }
        if (!userId) {
            res.status(400).json({ message: "Iser ID is required" });
            return;
        }
        try {
            const session = yield paymentService_1.default.retrieveCheckoutSession(sessionId);
            if (!session) {
                res.status(400).json({ message: "Session not found" });
                return;
            }
            if (session.payment_status === "paid") {
                (yield pool_1.pool.query("INSERT INTO credits (balance, user_id) SELECT balance + $1, $2 FROM credits WHERE user_id = $2 ORDER BY transaction_date DESC LIMIT 1", [credits, userId]));
                const result = (yield pool_1.pool.query("SELECT name, email FROM users WHERE id = $1", [userId]));
                const user = result.rows[0];
                userService_1.default.sendEmail(user.email, user.name, undefined, credits, undefined, "creditsEmail", "Credits added to balance");
                res.status(200).json({ paid: true, message: "Payment successful" });
            }
            else {
                res.status(400).json({ paid: false, message: "Payment failed" });
                return;
            }
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "verifying the payment");
            return;
        }
    }),
};
exports.default = paymentController;
