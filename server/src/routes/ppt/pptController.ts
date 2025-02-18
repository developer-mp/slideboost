import { Request, Response } from "express";
import storageService from "../../services/storage/storageService";
import handleError from "../../utils/common/handleError";
import { config } from "../../../env.config";
import { Content } from "../../interfaces/interfaces";
import aiService from "../../services/ai/aiService";
import pptService from "../../services/ppt/pptService";
import { clearUploadFolder } from "../../utils/storage/clearUploadFolder";

const tokenDataStore: Record<string, string> = {};

const pptController = {
  calculateTokens: async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId as string;
    const files = req.query.files as { file_id: string; file_type: string }[];

    if (!files) {
      res.status(400).json({ message: "File is required" });
      return;
    }

    const transcript = await pptService.generateTranscript(files);
    const tokenCount = Math.ceil(transcript.length / 4);

    tokenDataStore[userId] = transcript;

    res.status(200).json({
      message: "Token count calculated successfully",
      tokenCount,
    });
  },

  createPresentation: async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId as string;
    const templateId = req.query.templateId as string;
    const title = req.query.title as string;

    if (!templateId) {
      res.status(400).json({ message: "Template ID is required" });
      return;
    }

    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    try {
      const transcript = tokenDataStore[userId];
      if (!transcript) {
        res.status(400).json({
          message: "Transcript not found",
        });
        return;
      }

      const template = await storageService.downloadFile(
        templateId,
        "arraybuffer"
      );

      const typedTemplate: ArrayBuffer = template as ArrayBuffer;

      const contentString = await aiService.callAi(
        config.PROMPT_STRING,
        transcript
      );

      const content: Content = JSON.parse(contentString);

      const pptPath = await pptService.createPpt(typedTemplate, content, title);
      await pptService.uploadPptToStorage(userId, pptPath);

      await clearUploadFolder();

      res.status(200).json({
        message: "Presentation created successfully",
      });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "creating the presentation");
      return;
    }
  },
};

export default pptController;
