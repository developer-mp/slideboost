import apiService from "../app/apiService";
import { config } from "../../../env.config";
import { LoginResponseProps } from "../../interfaces/interfaces";

const authService = {
  async registerUser(name: string, email: string, password: string) {
    const endpoint = `${config.AUTH_ROUTER}${config.REGISTER_ENDPOINT}`;
    const response = await apiService.noSecurePostCall(endpoint, {
      name,
      email,
      password,
    });
    return response;
  },
  async verifyEmail(email: string, code: string) {
    const endpoint = `${config.AUTH_ROUTER}${config.VERIFY_ENDPOINT}`;
    const response = await apiService.noSecurePostCall(endpoint, {
      email,
      code,
    });
    return response;
  },
  async loginUser(
    email: string,
    password: string
  ): Promise<LoginResponseProps> {
    const endpoint = `${config.AUTH_ROUTER}${config.LOGIN_ENDPOINT}`;
    const response = await apiService.noSecurePostCall(endpoint, {
      email,
      password,
    });
    return response.data;
  },
};

export default authService;
