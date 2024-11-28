import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
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
    return await axios.post(url, data, reqConfig);
  },
  nonSecuredGetCall: async <T>(
    endpoint: string,
    params?: T
  ): Promise<AxiosResponse> => {
    const url = `${config.API_BASE_URL}${config.API}${config.API_VERSION}${endpoint}`;
    return await axios.get(url, { params });
  },
  // securedPostCall: async <T>(
  //   endpoint: string,
  //   data: T,
  //   param?: AxiosRequestConfig
  // ): Promise<AxiosResponse> => {
  //   const url = `${config.API_BASE_URL}${config.API}${config.API_VERSION}${endpoint}`;
  //   return await axios.post(url, data, {
  //     ...param,
  //     withCredentials: true,
  //   });
  // },
  securedGetCall: async <T>(
    endpoint: string,
    params?: T
  ): Promise<AxiosResponse> => {
    const url = `${config.API_BASE_URL}${config.API}${config.API_VERSION}${endpoint}`;
    return await axios.get(url, { params, withCredentials: true });
  },
};

export default apiService;
