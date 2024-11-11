import apiService from "../app/apiService";
import { config } from "../../../env.config";

const aiService = {
  processTranscript: async (transcript: string): Promise<{ text: string }> => {
    try {
      const endpoint = `${config.AI_ROUTER}${config.TRANSCRIPT_ENDPOINT}`;
      const response = await apiService.noSecurePostCall(endpoint, {
        transcript,
      });
      return response.data;
    } catch (error) {
      console.error("Error processing transcript:", error);
      throw error;
    }
  },
};

export default aiService;
