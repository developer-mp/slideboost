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

  async getDeactivationReasons(): Promise<void> {
    const endpoint = `${config.DATA_ROUTER}${config.DEACTIVATION_REASONS_ENDPOINT}`;
    try {
      const response = await apiService.getCall(endpoint, {});

      return response.data;
    } catch (error) {
      handleError.axiosError(error, "getting the deactivation reasons");
      throw error;
    }
  },

  async getSupportedFiles(): Promise<void> {
    const endpoint = `${config.DATA_ROUTER}${config.SUPPORTED_FILES_ENDPOINT}`;
    try {
      const response = await apiService.getCall(endpoint, {});

      return response.data;
    } catch (error) {
      handleError.axiosError(error, "getting the supported files");
      throw error;
    }
  },

  async getFaq(): Promise<void> {
    const endpoint = `${config.DATA_ROUTER}${config.FAQ_ENDPOINT}`;
    try {
      const response = await apiService.getCall(endpoint, {});

      return response.data;
    } catch (error) {
      handleError.axiosError(error, "getting the FAQ");
      throw error;
    }
  },

  async getNews(): Promise<void> {
    const endpoint = `${config.DATA_ROUTER}${config.NEWS_ENDPOINT}`;
    try {
      const response = await apiService.getCall(endpoint, {});

      return response.data;
    } catch (error) {
      handleError.axiosError(error, "getting the news");
      throw error;
    }
  },
};

export default dataService;
