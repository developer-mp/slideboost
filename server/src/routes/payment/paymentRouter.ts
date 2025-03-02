import Express from "express";
import paymentController from "./paymentController";

const paymentRouter = Express.Router();

paymentRouter.post("/checkout", paymentController.createPaymentLink);
paymentRouter.post("/verify-payment", paymentController.verifyPayment);

export default paymentRouter;
