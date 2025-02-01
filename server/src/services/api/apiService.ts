import axios, { AxiosResponse } from "axios";
import handleError from "../../utils/common/handleError";

const apiService = {
  postCall: async <T>(
    endpoint: string,
    data: object,
    headers: object
  ): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axios.post(endpoint, data, {
        headers,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "making a POST request to the API");
      throw error;
    }
  },

  getCall: async <T>(
    endpoint: string,
    data: object,
    headers: object
    // responseType: "json" | "text" | "arraybuffer" = "json"
  ): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axios.get(endpoint, {
        params: data,
        headers,
        // responseType,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "making a GET request to the API");
      throw error;
    }
  },
};

export default apiService;
