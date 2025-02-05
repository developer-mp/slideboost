import axios from "axios";
import { config } from "../../../env.config";
import {
  AuthorizeResponse,
  UploadFileResponse,
  UploadUrlResponse,
} from "../../interfaces/interfaces";
import { b2 } from "../../storage/config/storage";
import handleError from "../../utils/common/handleError";
import apiService from "../api/apiService";
import { FileResponseType } from "../../interfaces/types";

type FileDownloadResponse = {
  fileData: Blob; // Or an array buffer, depending on your response type
  fileName: string;
};

const storageService = {
  async authorizeStorage(): Promise<AuthorizeResponse | undefined> {
    try {
      const response = await b2.authorize();

      if (!response.data.authorizationToken) {
        throw new Error("Failed to authenticate with the storage");
      }

      return response.data;
    } catch (error: unknown) {
      handleError.serviceError(error, "authorizing with the storage");
      return;
    }
  },

  async getUploadUrl(bucketId: string): Promise<UploadUrlResponse | undefined> {
    try {
      const response = await b2.getUploadUrl({
        bucketId: bucketId,
      });

      if (!response.data.uploadUrl) {
        throw new Error("Failed to get the upload URL from the storage");
      }

      return response.data;
    } catch (error: unknown) {
      handleError.serviceError(error, "getting the storage upload URL");
      return;
    }
  },

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    bucketId: string
  ): Promise<UploadFileResponse | undefined> {
    try {
      const authData = await this.authorizeStorage();
      if (!authData) return;

      const uploadData = await this.getUploadUrl(bucketId);
      if (!uploadData) {
        return;
      }

      const { uploadUrl, authorizationToken } = uploadData;
      if (!uploadUrl || !authorizationToken) return;

      const response = await b2.uploadFile({
        uploadUrl: uploadUrl,
        uploadAuthToken: authorizationToken,
        fileName: fileName,
        data: fileBuffer,
      });

      if (!response.data.fileId) {
        throw new Error("Failed to upload the file to the storage");
      }

      return {
        fileId: response.data.fileId,
        fileName: response.data.fileName,
      } as UploadFileResponse;
    } catch (error: unknown) {
      handleError.serviceError(error, "uploading the file to the storage");
      return;
    }
  },

  async downloadFile<T>(
    fileId: string,
    responseType: FileResponseType
  ): Promise<T> {
    const endpoint = `${config.STORAGE_API_URL}${config.STORAGE_DOWNLOAD_FILE_BY_ID}`;
    try {
      const authData = await this.authorizeStorage();
      if (!authData) return {} as T;

      const headers = {
        Authorization: authData.authorizationToken,
      };

      const data = { fileId };
      const response = await apiService.getCall<T>(
        endpoint,
        data,
        headers,
        responseType
      );
      return response;
    } catch (error) {
      handleError.serviceError(error, "downloading the file from the storage");
      return {} as T;
    }
  },

  async deleteFile(fileId: string, fileName: string): Promise<void> {
    const endpoint = `${config.STORAGE_API_URL}${config.STORAGE_DELETE_URL}`;
    try {
      const authData = await this.authorizeStorage();
      if (!authData) return;

      const data = { fileName, fileId };

      const headers = {
        Authorization: authData.authorizationToken,
      };

      await apiService.postCall(endpoint, data, headers);
    } catch (error) {
      handleError.serviceError(error, "deleting the file from the storage");
      return;
    }
  },
};

export default storageService;
