import Express from "express";
import paymentController from "./paymentController";

const paymentRouter = Express.Router();

paymentRouter.post("/checkout", paymentController.createPaymentLink);

export default paymentRouter;
