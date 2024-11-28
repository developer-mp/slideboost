import apiService from "../app/apiService";
import { config } from "../../../env.config";

const pptService = {
  processPpt: async (filePath: string, transcript: string) => {
    try {
      const endpoint = `${config.PPT_ROUTER}${config.PPT_ENDPOINT}`;
      const response = await apiService.postCall(endpoint, {
        filePath,
        transcript,
      });
      return response.data;
    } catch (error) {
      console.error("Error processing presentation:", error);
      throw error;
    }
  },
};

export default pptService;
