import apiService from "../app/apiService";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";

const pptService = {
  processPpt: async (filePath: string, transcript: string) => {
    const endpoint = `${config.PPT_ROUTER}${config.PPT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        filePath,
        transcript,
      });
      return response.data;
    } catch (error) {
      handleError.serviceError(error, "processing the presentation");
      throw error;
    }
  },
};

export default pptService;
