import apiService from "../app/apiService";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";

const paymentService = {
  async createCheckout(amount: number): Promise<string> {
    const endpoint = `${config.PAYMENT_ROUTER}${config.PAYMENT_ENDPOINT}`;

    try {
      const response = await apiService.postCall(endpoint, {
        amount,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "creating the checkout session");
      throw error;
    }
  },
};

export default paymentService;
