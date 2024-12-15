import apiService from "../app/apiService";
import { config } from "../../../env.config";
import { AxiosError } from "axios";
import {
  LoginResponse,
  MessageResponse,
  RegisterResponse,
  SendEmailResponse,
  UpdateUserNameResponse,
  TokenResponse,
} from "../../interfaces/interfaces";

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
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while registering the user in the Auth Service"
      );
    }
  },

  async verifyEmail(email: string, code: string): Promise<MessageResponse> {
    const endpoint = `${config.USER_ROUTER}${config.VERIFY_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        email,
        code,
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while verifying the email in the Auth Service"
      );
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
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while logging in the user in the Auth Service"
      );
    }
  },

  async loginUserWithGoogle(idToken: string): Promise<LoginResponse> {
    const endpoint = `${config.USER_ROUTER}${config.GOOGLE_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        idToken,
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while logging in the user with Google in the Auth Service"
      );
    }
  },

  async logoutUser(): Promise<MessageResponse> {
    const endpoint = `${config.USER_ROUTER}${config.LOGOUT_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {});
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while logging out the user in the Auth Service"
      );
    }
  },

  async verifyToken(): Promise<TokenResponse> {
    const endpoint = `${config.USER_ROUTER}${config.TOKEN_ENDPOINT}`;
    try {
      const response = await apiService.getCall(endpoint, {});
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while verifying the token in the Auth Service"
      );
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
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message ?? error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while refreshing the token in the Auth Service"
      );
    }
  },

  async sendEmail(email: string): Promise<SendEmailResponse> {
    const endpoint = `${config.USER_ROUTER}${config.EMAIL_ENDPOINT}`;
    try {
      const response = await apiService.postCall(endpoint, {
        email,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while sending the email in the Auth Service"
      );
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
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while updating the user name in the Auth Service"
      );
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
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while updating the password in the Auth Service"
      );
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
      if (error instanceof Error) {
        const errorMessage = error.message;
        throw new Error(errorMessage);
      }
      throw new Error(
        "An unknown error occurred while deactivating the account in the Auth Service"
      );
    }
  },
};

export default userService;
