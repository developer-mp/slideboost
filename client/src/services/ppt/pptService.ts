import apiService from "../app/apiService";
import { config } from "../../../env.config";

const pptService = {
  createPPT: async (
    templateId: string,
    transcript: string[]
  ): Promise<string> => {
    try {
      const endpoint = `${config.PPT_ROUTER}`;
      const configType = { responseType: "blob" } as const;

      const response = await apiService.noSecurePostCall<{
        templateId: string;
        transcript: string[];
      }>(endpoint, { templateId, transcript }, configType);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      return url;
    } catch (error) {
      console.error("Error creating PowerPoint:", error);
      throw error;
    }
  },
};

export default pptService;
