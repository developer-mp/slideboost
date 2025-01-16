import apiService from "../app/apiService";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";

const storageService = {
  async uploadFile(file: File[], userId: string): Promise<string> {
    const formData = new FormData();
    let folder = "media";

    file.forEach((f) => {
      if (
        f.type === "application/vnd.ms-powerpoint" ||
        f.name.endsWith(".pptx") ||
        f.name.endsWith(".ppt")
      ) {
        folder = "templates";
      }
      formData.append("file", f);
    });

    const endpoint = `${config.STORAGE_ROUTER}${config.UPLOAD_ENDPOINT}`;

    try {
      const response = await apiService.postCall(endpoint, formData, {
        params: { userId, folder },
      });

      return response.data;
    } catch (error) {
      handleError.axiosError(error, "uploading the file to the storage");
      throw error;
    }
  },
  async getFileMetadata(userId: string): Promise<[]> {
    const endpoint = `${config.STORAGE_ROUTER}${config.METADATA_ENDPOINT}`;

    try {
      const response = await apiService.getCall(endpoint, {
        userId,
      });

      return response.data;
    } catch (error) {
      handleError.axiosError(
        error,
        "retrieving file metadata from the storage"
      );
      throw error;
    }
  },
};

export default storageService;
