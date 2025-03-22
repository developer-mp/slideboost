import { Request, Response } from "express";
import handleError from "../../utils/common/handleError";
import paymentService from "../../services/payment/paymentService";
import { pool } from "../../db/config/pool";
import { DbQueryResultProps } from "../../interfaces/interfaces";
import userService from "../../services/user/userService";
import { config } from "../../../env.config";

const paymentController = {
  createPaymentLink: async (req: Request, res: Response): Promise<void> => {
    try {
      const { amount, userId } = req.body;

      const sessionUrl = await paymentService.createCheckoutSession(
        amount,
        userId
      );

      if (sessionUrl) {
        res.status(200).json({ url: sessionUrl });
      }
    } catch (error: unknown) {
      handleError.controllerError(res, error, "creating the payment link");
      return;
    }
  },

  verifyPayment: async (req: Request, res: Response): Promise<void> => {
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
      const session = await paymentService.retrieveCheckoutSession(sessionId);

      if (!session) {
        res.status(400).json({ message: "Session not found" });
        return;
      }

      if (session.payment_status === "paid") {
        (await pool.query(
          "INSERT INTO credits (balance, user_id) SELECT balance + $1, $2 FROM credits WHERE user_id = $2 ORDER BY transaction_date DESC LIMIT 1",
          [credits, userId]
        )) as DbQueryResultProps;

        const result = (await pool.query(
          "SELECT name, email FROM users WHERE id = $1",
          [userId]
        )) as DbQueryResultProps;

        const user = result.rows[0];

        userService.sendEmail(
          config.EMAIL,
          user.email,
          user.name,
          undefined,
          credits,
          undefined,
          "creditsEmail",
          "Credits added to balance",
          undefined
        );

        res.status(200).json({ paid: true, message: "Payment successful" });
      } else {
        res.status(400).json({ paid: false, message: "Payment failed" });
        return;
      }
    } catch (error: unknown) {
      handleError.controllerError(res, error, "verifying the payment");
      return;
    }
  },
};

export default paymentController;
