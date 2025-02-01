import { config } from "../../../env.config";
import handleError from "../../utils/common/handleError";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: config.AI_API_KEY,
});

const aiService = {
  async callAi(prompt: string, transcript: string): Promise<string> {
    const formattedPrompt = prompt.replace("[transcript]", transcript);

    try {
      const completion = await openai.chat.completions.create({
        model: config.AI_MODEL,
        messages: [{ role: "user", content: formattedPrompt }],
        temperature: config.AI_TEMPERATURE,
        max_tokens: config.AI_MAX_TOKENS,
      });

      const response = completion.choices[0].message.content;

      if (!response) {
        throw new Error("Received empty response from AI");
      }

      return response;
    } catch (error) {
      handleError.serviceError(error, "processing AI request");
      throw error;
    }
  },
};

export default aiService;
