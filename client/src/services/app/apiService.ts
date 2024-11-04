import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { config } from "../../../env.config";

const apiService = {
  noSecurePostCall: async <T>(
    endpoint: string,
    data: T,
    param?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
    const url = `${config.API_BASE_URL}${config.API}${config.API_VERSION}${endpoint}`;
    return await axios.post(url, data, param);
  },

  noSecureGetCall: async <T>(
    endpoint: string,
    params?: T
  ): Promise<AxiosResponse> => {
    const url = `${config.API_BASE_URL}${config.API}${config.API_VERSION}${endpoint}`;
    return await axios.get(url, { params });
  },
};

export default apiService;
