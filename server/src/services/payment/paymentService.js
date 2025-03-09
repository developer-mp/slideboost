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
const stripe_1 = __importDefault(require("stripe"));
const env_config_1 = require("../../../env.config");
const handleError_1 = __importDefault(require("../../utils/common/handleError"));
const payment = new stripe_1.default(env_config_1.config.PAYMENT_SECRET_KEY);
const clientUrl = env_config_1.config.CLIENT_HOST + ":" + env_config_1.config.CLIENT_PORT;
const paymentService = {
    createCheckoutSession: (amount, userId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const amountInCents = Math.round(amount * 100);
            const session = yield payment.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: "Credits",
                            },
                            unit_amount: amountInCents,
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${clientUrl}/cancel`,
                payment_intent_data: {
                    metadata: {
                        userId: userId,
                    },
                },
            });
            return (_a = session.url) !== null && _a !== void 0 ? _a : "";
        }
        catch (error) {
            handleError_1.default.serviceError(error, "creating the payment link");
            return "";
        }
    }),
    retrieveCheckoutSession: (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const session = yield payment.checkout.sessions.retrieve(sessionId);
            return session;
        }
        catch (error) {
            handleError_1.default.serviceError(error, "retrieving the payment session");
            return null;
        }
    }),
};
exports.default = paymentService;
