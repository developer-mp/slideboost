import axios, { AxiosInstance, AxiosResponse } from "axios";
import { config } from "../../../env.config";
import { ApiRequestData } from "../../interfaces/interfaces";

const AIApi: AxiosInstance = axios.create({
  baseURL: config.AI_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const aiService = {
  async callAI(prompt: string, data: string[]): Promise<AxiosResponse> {
    const postData: ApiRequestData = {
      contents: [
        {
          parts: [
            {
              text: `${prompt}: ${data.join(", ")}`,
            },
          ],
        },
      ],
    };

    return AIApi.post(
      `${config.AI_API_ENDPOINT}${config.AI_API_KEY}`,
      postData
    );
  },
};

export default aiService;
