import apiService from "../app/apiService";
import { config } from "../../../env.config";

const aiService = {
  processTranscript: async (transcript: string): Promise<string> => {
    const endpoint = `${config.AI_ROUTER}${config.TRANSCRIPT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        transcript,
      });
      return response.data.text;
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while processing transcript in the AI Service"
      );
    }
  },
};

export default aiService;
