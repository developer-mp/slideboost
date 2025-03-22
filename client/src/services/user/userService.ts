import apiService from "../app/apiService";
import { config } from "../../../env.config";
import {
  LoginResponse,
  MessageResponse,
  RegisterResponse,
  VerifyEmailResponse,
  SendEmailResponse,
  UpdateUserNameResponse,
  TokenResponse,
} from "../../interfaces/interfaces";
import handleError from "../../utils/common/handleError";

const userService = {
  async registerUser(
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> {
    const endpoint = `${config.USER_ROUTER}${config.REGISTER_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      handleError.axiosError(error, "registering the user");
      throw error;
    }
  },

  async verifyEmail(email: string, code: string): Promise<VerifyEmailResponse> {
    const endpoint = `${config.USER_ROUTER}${config.VERIFY_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        email,
        code,
      });
      return response.data;
    } catch (error) {
      handleError.axiosError(error, "verifying the email");
      throw error;
    }
  },

  async loginUser(email: string, password: string): Promise<LoginResponse> {
    const endpoint = `${config.USER_ROUTER}${config.LOGIN_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      handleError.axiosError(error, "logging in the user");
      throw error;
    }
  },

  async loginUserWithGoogle(idToken: string): Promise<LoginResponse> {
    const endpoint = `${config.USER_ROUTER}${config.LOGIN_GOOGLE_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        idToken,
      });
      return response.data;
    } catch (error) {
      handleError.axiosError(error, "logging in the user with Google");
      throw error;
    }
  },

  async logoutUser(): Promise<MessageResponse> {
    const endpoint = `${config.USER_ROUTER}${config.LOGOUT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {});
      return response.data;
    } catch (error) {
      handleError.axiosError(error, "logging out the user");
      throw error;
    }
  },

  async verifyToken(): Promise<TokenResponse> {
    const endpoint = `${config.USER_ROUTER}${config.VERIFY_TOKEN_ENDPOINT}`;
    try {
      const response = await apiService.getCall(endpoint, {});
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "verifying the token");
      throw error;
    }
  },

  async refreshToken(email: string): Promise<TokenResponse> {
    const endpoint = `${config.USER_ROUTER}${config.REFRESH_TOKEN_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        email,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "refreshing the token");
      throw error;
    }
  },

  async sendEmail(
    email: string,
    template: string,
    subject: string
  ): Promise<SendEmailResponse> {
    const endpoint = `${config.USER_ROUTER}${config.EMAIL_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        email,
        template,
        subject,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "sending the email");
      throw error;
    }
  },

  async updateUserName(
    name: string,
    email: string
  ): Promise<UpdateUserNameResponse> {
    const endpoint = `${config.USER_ROUTER}${config.USER_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        name,
        email,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "updating the user name");
      throw error;
    }
  },

  async updatePassword(
    password: string,
    email: string
  ): Promise<MessageResponse> {
    const endpoint = `${config.USER_ROUTER}${config.PASSWORD_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        password,
        email,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "updating the password");
      throw error;
    }
  },

  async deactivateAccount(
    email: string,
    reason: string
  ): Promise<MessageResponse> {
    const endpoint = `${config.USER_ROUTER}${config.DEACTIVATION_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        email,
        reason,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "deactivating the account");
      throw error;
    }
  },

  async getCreditBalance(userId: string): Promise<void> {
    const endpoint = `${config.USER_ROUTER}${config.BALANCE_ENDPOINT}`;

    try {
      const response = await apiService.getCall(endpoint, { userId });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "retrieving the credit balance");
      throw error;
    }
  },

  async sendContactForm(formData: {
    name: string;
    email: string;
    message: string;
  }): Promise<SendEmailResponse> {
    const endpoint = `${config.USER_ROUTER}${config.CONTACT_FORM_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        formData,
      });
      return response.data;
    } catch (error: unknown) {
      handleError.axiosError(error, "sending the contact form");
      throw error;
    }
  },
};

export default userService;
