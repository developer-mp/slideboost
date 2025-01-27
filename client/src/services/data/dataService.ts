import apiService from "../app/apiService";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";

const dataService = {
  async getTemplateCategories(): Promise<void> {
    const endpoint = `${config.DATA_ROUTER}${config.TEMPLATES_ENDPOINT}`;

    try {
      const response = await apiService.getCall(endpoint, {});

      return response.data;
    } catch (error) {
      handleError.axiosError(error, "getting the template categories");
      throw error;
    }
  },
};

export default dataService;
