import apiService from "../app/apiService";
import { config } from "../../../env.config";

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
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while processing presentation in the PPT Service"
      );
    }
  },
};

export default pptService;
