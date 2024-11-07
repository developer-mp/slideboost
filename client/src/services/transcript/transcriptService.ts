import apiService from "../app/apiService";
import { config } from "../../../env.config";

const transcriptService = {
  fetchTranscriptFromImage: async (filePath: string) => {
    try {
      const endpoint = `${config.TRANSCRIPT_ROUTER}${config.IMGTOTXT_ENDPOINT}`;
      const response = await apiService.noSecurePostCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving transcript from image:", error);
      throw error;
    }
  },
  fetchTranscriptFromAudio: async (filePath: string) => {
    try {
      const endpoint = `${config.TRANSCRIPT_ROUTER}${config.AUDIOTOTXT_ENDPOINT}`;
      const response = await apiService.noSecurePostCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving transcript from audio:", error);
      throw error;
    }
  },
  fetchTranscriptFromVideo: async (filePath: string) => {
    try {
      const endpoint = `${config.TRANSCRIPT_ROUTER}${config.VIDEOTOTXT_ENDPOINT}`;
      const response = await apiService.noSecurePostCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving transcript from video:", error);
      throw error;
    }
  },
  fetchTranscriptFromYoutube: async (filePath: string) => {
    try {
      const endpoint = `${config.TRANSCRIPT_ROUTER}${config.YOUTUBETOTXT_ENDPOINT}`;
      const response = await apiService.noSecurePostCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving transcript from Youtube:", error);
      throw error;
    }
  },
};

export default transcriptService;
