import apiService from "../app/apiService";
import { config } from "../../../env.config";

const userService = {
  async updateUserName(name: string, email: string) {
    const endpoint = `${config.AUTH_ROUTER}${config.USER_ENDPOINT}`;
    const response = await apiService.noSecurePostCall(endpoint, {
      name,
      email,
    });
    return response;
  },
  async updatePassword(password: string, email: string): Promise<void> {
    const endpoint = `${config.AUTH_ROUTER}${config.PASSWORD_ENDPOINT}`;
    await apiService.noSecurePostCall(endpoint, {
      password,
      email,
    });
  },
  async deactivateAccount(email: string, reason: string): Promise<void> {
    const endpoint = `${config.AUTH_ROUTER}${config.DEACTIVATION_ENDPOINT}`;
    await apiService.noSecurePostCall(endpoint, {
      email,
      reason,
    });
  },
};

export default userService;
