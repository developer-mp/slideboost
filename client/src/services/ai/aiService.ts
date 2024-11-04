import apiService from "../app/apiService";
import { config } from "../../../env.config";

const aiService = {
  cleanTranscript: async (
    prompt: string,
    transcript: string[]
  ): Promise<string> => {
    try {
      const endpoint = `${config.AI_ROUTER}`;
      const response = await apiService.noSecurePostCall(endpoint, {
        prompt: prompt,
        data: transcript,
      });
      const formattedTranscript =
        response?.data?.candidates[0]?.content?.parts[0]?.text;
      return formattedTranscript;
    } catch (error) {
      console.error("Error formatting transcript:", error);
      throw error;
    }
  },
};

export default aiService;
