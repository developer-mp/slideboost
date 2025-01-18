import axios, { AxiosResponse } from "axios";
import handleError from "../../utils/handleError";

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
};

export default apiService;
