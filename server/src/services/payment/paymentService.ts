import Stripe from "stripe";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";

const payment = new Stripe(config.PAYMENT_SECRET_KEY);
const clientUrl = config.CLIENT_HOST;

const paymentService = {
  createCheckoutSession: async (
    amount: number,
    userId: string
  ): Promise<string> => {
    try {
      const amountInCents = Math.round(amount * 100);
      const session = await payment.checkout.sessions.create({
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

      return session.url ?? "";
    } catch (error) {
      handleError.serviceError(error, "creating the payment link");
      return "";
    }
  },

  retrieveCheckoutSession: async (
    sessionId: string
  ): Promise<Stripe.Checkout.Session | null> => {
    try {
      const session = await payment.checkout.sessions.retrieve(sessionId);

      return session;
    } catch (error) {
      handleError.serviceError(error, "retrieving the payment session");
      return null;
    }
  },
};

export default paymentService;
