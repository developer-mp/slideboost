import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";

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
      handleError.axiosError(error, "making a POST request to the API");
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
      handleError.axiosError(error, "making a GET request to the API");
      throw error;
    }
  },
};

export default apiService;
