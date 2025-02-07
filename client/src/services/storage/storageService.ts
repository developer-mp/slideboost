import apiService from "../app/apiService";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";
import { FileWithMetadata } from "../../interfaces/interfaces";

const storageService = {
  async uploadFile(file: FileWithMetadata[], userId: string): Promise<string> {
    const formData = new FormData();
    let folder = "media";

    file.forEach((f) => {
      if (
        f.file.type === "application/vnd.ms-powerpoint" ||
        f.file.name.endsWith(".pptx") ||
        f.file.name.endsWith(".ppt")
      ) {
        folder = "templates";
      }
      formData.append("file", f.file);
      if (f.category !== null) {
        formData.append("category", f.category);
      }
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

  async deleteFile(fileId: string, fileName: string): Promise<string> {
    const endpoint = `${config.STORAGE_ROUTER}${config.DELETE_ENDPOINT}`;

    try {
      const response = await apiService.postCall(endpoint, null, {
        params: { fileId, fileName },
      });

      return response.data;
    } catch (error) {
      handleError.axiosError(error, "deleting the file from the storage");
      throw error;
    }
  },
};

export default storageService;
