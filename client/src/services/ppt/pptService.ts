import apiService from "../app/apiService";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";

const pptService = {
  async generatePpt(
    userId: string,
    files: { file_id: string; file_type: string }[],
    templateId: string,
    title: string
  ): Promise<string> {
    const endpoint = `${config.PPT_ROUTER}${config.PPT_ENDPOINT}`;

    try {
      const response = await apiService.getCall(endpoint, {
        userId,
        files,
        templateId,
        title,
      });

      return response.data;
    } catch (error) {
      handleError.axiosError(error, "creating the presentation");
      throw error;
    }
  },
};

export default pptService;
