import apiService from "../app/apiService";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";

const paymentService = {
  async createCheckout(amount: number, userId: string): Promise<string> {
    const endpoint = `${config.PAYMENT_ROUTER}${config.CHECKOUT_ENDPOINT}`;

    try {
      const response = await apiService.postCall(endpoint, {
        amount,
        userId,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "creating the checkout session");
      throw error;
    }
  },

  async verifyPayment(
    sessionId: string,
    credits: number,
    userId: string
  ): Promise<void> {
    const endpoint = `${config.PAYMENT_ROUTER}${config.VERIFY_PAYMENT_ENDPOINT}`;

    try {
      const response = await apiService.postCall(endpoint, {
        sessionId,
        credits,
        userId,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "verifying the payment");
      throw error;
    }
  },
};

export default paymentService;
