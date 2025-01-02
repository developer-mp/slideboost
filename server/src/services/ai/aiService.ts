import axios from "axios";
import { config } from "../../../env.config";

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
      throw new Error("Error processing AI request");
    }
  },
};

export default aiService;
