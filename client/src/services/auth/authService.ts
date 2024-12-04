import apiService from "../app/apiService";
import { config } from "../../../env.config";
import { AxiosError } from "axios";

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

  async logoutUser() {
    const endpoint = `${config.AUTH_ROUTER}${config.LOGOUT_ENDPOINT}`;
    const response = await apiService.postCall(endpoint, {});
    return response.data;
  },

  async verifyToken() {
    try {
      const endpoint = `${config.AUTH_ROUTER}${config.TOKEN_ENDPOINT}`;
      const response = await apiService.getCall(endpoint, {});
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while verifying the token in the authentication service"
      );
    }
  },

  async refreshToken(email: string) {
    try {
      const endpoint = `${config.AUTH_ROUTER}${config.REFRESH_TOKEN_ENDPOINT}`;
      const response = await apiService.postCall(endpoint, {
        email,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message ?? error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while refreshing the token in the Authentication Service"
      );
    }
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
