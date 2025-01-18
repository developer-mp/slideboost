import { Request, Response } from "express";
import { config } from "../../../env.config";
import aiService from "../../services/ai/aiService";
import handleError from "../../utils/common/handleError";

const AiController = {
  formatTranscript: async (req: Request, res: Response): Promise<void> => {
    const { transcript } = req.body;

    try {
      if (!transcript) {
        res.status(400).json({ message: "No transcript provided" });
        return;
      }

      const prompt = config.PROMPT_STRING;

      const formattedText = await aiService.callAi(prompt, transcript);

      res.status(200).json({ text: formattedText });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "formatting the transcript");
    }
  },
};

export default AiController;
