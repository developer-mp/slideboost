import { b2 } from "../../storage/config/storage";
import handleError from "../../utils/handleError";

const storageService = {
  async authorizeStorage() {
    try {
      const response = await b2.authorize();

      if (!response.data.authorizationToken) {
        throw new Error("Failed to authenticate with the storage");
      }

      return response.data;
    } catch (error: unknown) {
      handleError.serviceError(error, "authorizing with the storage");
      return null;
    }
  },

  async getUploadUrl(bucketId: string) {
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
      return null;
    }
  },

  async uploadFile(fileBuffer: Buffer, fileName: string, bucketId: string) {
    try {
      const authData = await this.authorizeStorage();
      if (!authData) return;

      const { uploadUrl, authorizationToken } = await this.getUploadUrl(
        bucketId
      );
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

      return response;
    } catch (error: unknown) {
      handleError.serviceError(error, "uploading the file to the storage");
      return;
    }
  },
};

export default storageService;
