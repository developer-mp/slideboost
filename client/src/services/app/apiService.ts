import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import { config } from "../../../env.config";

const apiService = {
  postCall: async <T>(
    endpoint: string,
    data: T,
    param?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
    const url = `${config.API_BASE_URL}${config.API}${config.API_VERSION}${endpoint}`;
    const reqConfig: AxiosRequestConfig = {
      ...param,
      withCredentials: true,
    };
    try {
      const response = await axios.post(url, data, reqConfig);
      return response;
    } catch (error: unknown) {
      console.error("Error occurred during the API call: ", error);
      throw error;
    }
  },
  async getCall<T>(endpoint: string, data: T): Promise<AxiosResponse> {
    const url = `${config.API_BASE_URL}${config.API}${config.API_VERSION}${endpoint}`;
    const reqConfig: AxiosRequestConfig = {
      withCredentials: true,
      params: data,
    };

    try {
      const response = await axios.get(url, reqConfig);
      return response;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Error from the server: ", errorMessage);
        throw new Error(errorMessage);
      } else if (error instanceof Error) {
        console.error(
          "Unexpected error occurred during the API call: ",
          error.message
        );
        throw new Error(error.message);
      }
      console.error("An unknown error occurred during the API call");
      throw new Error("An unknown error occurred during the API call");
    }
  },
};

export default apiService;
