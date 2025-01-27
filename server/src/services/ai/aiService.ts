import axios from "axios";
import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";

const aiService = {
  async callAi(prompt: string, transcript: string): Promise<string> {
    const formattedPrompt = prompt.replace("[transcript]", transcript);

    try {
      const response = await axios.post(
        config.AI_API_URL,
        {
          model: config.AI_MODEL,
          prompt: formattedPrompt,
          max_tokens: config.AI_MAX_TOKENS,
          temperature: config.AI_TEMPERATURE,
        },
        {
          headers: {
            Authorization: `Bearer ${config.AI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].text.trim();
    } catch (error) {
      handleError.serviceError(error, "processing AI request");
      throw error;
    }
  },
};

export default aiService;
