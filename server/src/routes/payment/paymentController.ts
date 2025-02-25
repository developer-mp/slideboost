import { Request, Response } from "express";
import handleError from "../../utils/common/handleError";
import paymentService from "../../services/payment/paymentService";

const paymentController = {
  createPaymentLink: async (req: Request, res: Response): Promise<void> => {
    try {
      const { amount } = req.body;

      const sessionUrl = await paymentService.createCheckoutSession(amount);

      if (sessionUrl) {
        res.status(200).json({ url: sessionUrl });
      }
    } catch (error: unknown) {
      handleError.controllerError(res, error, "creating the payment link");
    }
  },
};

export default paymentController;
