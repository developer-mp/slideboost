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
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      } else if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred during the API call");
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
        throw new Error(errorMessage);
      } else if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred during the API call");
    }
  },
};

export default apiService;
