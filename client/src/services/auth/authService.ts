import apiService from "../app/apiService";
import { config } from "../../../env.config";

const authService = {
  async registerUser(name: string, email: string, password: string) {
    const endpoint = `${config.AUTH_ROUTER}${config.REGISTER_ENDPOINT}`;
    const response = await apiService.postCall(endpoint, {
      name,
      email,
      password,
    });
    return response.data;
  },
  async verifyEmail(email: string, code: string) {
    const endpoint = `${config.AUTH_ROUTER}${config.VERIFY_ENDPOINT}`;
    const response = await apiService.postCall(endpoint, {
      email,
      code,
    });
    return response.data;
  },
  async loginUser(email: string, password: string) {
    const endpoint = `${config.AUTH_ROUTER}${config.LOGIN_ENDPOINT}`;
    const response = await apiService.postCall(endpoint, {
      email,
      password,
    });
    return response.data;
  },
  async sendEmail(email: string) {
    const endpoint = `${config.AUTH_ROUTER}${config.EMAIL_ENDPOINT}`;
    const response = await apiService.postCall(endpoint, {
      email,
    });
    return response.data;
  },
  async updateUserName(name: string, email: string) {
    const endpoint = `${config.AUTH_ROUTER}${config.USER_ENDPOINT}`;
    const response = await apiService.postCall(endpoint, {
      name,
      email,
    });
    return response.data;
  },
  async updatePassword(password: string, email: string) {
    const endpoint = `${config.AUTH_ROUTER}${config.PASSWORD_ENDPOINT}`;
    const response = await apiService.postCall(endpoint, {
      password,
      email,
    });
    return response.data;
  },
  async deactivateAccount(email: string, reason: string) {
    const endpoint = `${config.AUTH_ROUTER}${config.DEACTIVATION_ENDPOINT}`;
    const response = await apiService.postCall(endpoint, {
      email,
      reason,
    });
    return response.data;
  },
};

export default authService;
