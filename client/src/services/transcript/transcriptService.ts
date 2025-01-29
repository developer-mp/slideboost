import apiService from "../app/apiService";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";

const transcriptService = {
  fetchTranscriptFromText: async (filePath: string) => {
    const endpoint = `${config.TRANSCRIPT_ROUTER}${config.TEXT_TO_TXT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "retrieving the transcript from the text");
      throw error;
    }
  },

  fetchTranscriptFromImage: async (filePath: string) => {
    const endpoint = `${config.TRANSCRIPT_ROUTER}${config.IMG_TO_TXT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "retrieving the transcript from the image");
      throw error;
    }
  },

  fetchTranscriptFromAudio: async (filePath: string) => {
    const endpoint = `${config.TRANSCRIPT_ROUTER}${config.AUDIO_TO_TXT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "retrieving the transcript from the audio");
      throw error;
    }
  },

  fetchTranscriptFromVideo: async (filePath: string) => {
    const endpoint = `${config.TRANSCRIPT_ROUTER}${config.VIDEO_TO_TXT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "retrieving the transcript from the video");
      throw error;
    }
  },

  fetchTranscriptFromYoutube: async (filePath: string) => {
    const endpoint = `${config.TRANSCRIPT_ROUTER}${config.YOUTUBE_TO_TXT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(
        error,
        "retrieving the transcript from the Youtube"
      );
      throw error;
    }
  },
};

export default transcriptService;
