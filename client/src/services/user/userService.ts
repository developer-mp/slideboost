import apiService from "../app/apiService";
import { config } from "../../../env.config";

const userService = {
  async updateUserName(name: string, email: string): Promise<void> {
    const endpoint = `${config.AUTH_ROUTER}${config.USER_ENDPOINT}`;
    await apiService.noSecurePostCall(endpoint, {
      name,
      email,
    });
  },
  async updatePassword(password: string, email: string): Promise<void> {
    const endpoint = `${config.AUTH_ROUTER}${config.PASSWORD_ENDPOINT}`;
    await apiService.noSecurePostCall(endpoint, {
      password,
      email,
    });
  },
};

export default userService;
