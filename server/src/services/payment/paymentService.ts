import Stripe from "stripe";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";

const payment = new Stripe(config.PAYMENT_SECRET_KEY);
const clientUrl = config.CLIENT_HOST;
+":" + config.CLIENT_PORT;

const paymentService = {
  createCheckoutSession: async (amount: number): Promise<string> => {
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
      });

      return session.url ?? "";
    } catch (error) {
      handleError.serviceError(error, "creating the payment link");
      return "";
    }
  },
};

export default paymentService;
