import apiService from "../app/apiService";
import { config } from "../../../env.config";

const transcriptService = {
  fetchTranscriptFromText: async (filePath: string) => {
    const endpoint = `${config.TRANSCRIPT_ROUTER}${config.TEXTTOTXT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while retrieving transcript from the text in the Transcript Service"
      );
    }
  },
  fetchTranscriptFromImage: async (filePath: string) => {
    const endpoint = `${config.TRANSCRIPT_ROUTER}${config.IMGTOTXT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while retrieving transcript from the image in the Transcript Service"
      );
    }
  },
  fetchTranscriptFromAudio: async (filePath: string) => {
    const endpoint = `${config.TRANSCRIPT_ROUTER}${config.AUDIOTOTXT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while retrieving transcript from the audio in the Transcript Service"
      );
    }
  },
  fetchTranscriptFromVideo: async (filePath: string) => {
    const endpoint = `${config.TRANSCRIPT_ROUTER}${config.VIDEOTOTXT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while retrieving transcript from the video in the Transcript Service"
      );
    }
  },
  fetchTranscriptFromYoutube: async (filePath: string) => {
    const endpoint = `${config.TRANSCRIPT_ROUTER}${config.YOUTUBETOTXT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        filePath,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while retrieving transcript from Youtube in the Transcript Service"
      );
    }
  },
};

export default transcriptService;
