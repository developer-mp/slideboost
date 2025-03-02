import { Request, Response } from "express";
import handleError from "../../utils/common/handleError";
import paymentService from "../../services/payment/paymentService";
const stripe = require("stripe")(
  "sk_test_51KJAQDAvVYPj6YPQC32PBDweVGuIkRvXSwbrL5hdm1uFrIg1Viscx5h5vFI7t5B5NnsIF4GBGyn1lVsNT6nSaEW800jLgnTSNP"
);

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
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(400).json({ message: "Session ID is required" });
      return;
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(
        sessionId as string
      );

      if (session.payment_status === "paid") {
        // Update the user database with the payment details
        // Example: await paymentService.updateUserCredits(session.metadata.userId, session.amount_total);

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

  // handleStripeWebhook: async (req: Request, res: Response): Promise<void> => {
  //   const sig = req.headers["stripe-signature"] as string;
  //   let event;

  //   try {
  //     event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

  //     if (event.type === "checkout.session.completed") {
  //       const session = event.data.object as Stripe.Checkout.Session;

  //       if (session.payment_status === "paid") {
  //         res.status(200).json({ message: "Payment successful" });
  //       } else {
  //         res.status(400).json({ message: "Payment failed" });
  //       }
  //     }
  //   } catch (error: unknown) {
  //     handleError.controllerError(res, error, "confirming the payment");
  //     return;
  //   }
  // },
};

export default paymentController;
