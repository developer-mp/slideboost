import apiService from "../app/apiService";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";

const aiService = {
  processTranscript: async (transcript: string): Promise<string> => {
    const endpoint = `${config.AI_ROUTER}${config.TRANSCRIPT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        transcript,
      });
      return response.data.text;
    } catch (error) {
      handleError.axiosError(error, "processing the transcript");
      throw error;
    }
  },
};

export default aiService;
