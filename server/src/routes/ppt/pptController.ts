import { Request, Response } from "express";
import storageService from "../../services/storage/storageService";
import handleError from "../../utils/common/handleError";
import { config } from "../../../env.config";
import { Content } from "../../interfaces/interfaces";
import aiService from "../../services/ai/aiService";
import pptService from "../../services/ppt/pptService";
import { clearUploadFolder } from "../../utils/storage/clearUploadFolder";

const pptController = {
  createPresentation: async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId as string;
    const fileId = req.query.fileId as string[];
    const templateId = req.query.templateId as string;
    const title = req.query.title as string;

    if (!fileId) {
      res.status(400).json({ message: "File ID is required" });
      return;
    }

    if (!templateId) {
      res.status(400).json({ message: "Template ID is required" });
      return;
    }

    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    try {
      let allExtractedText = "";

      for (const id of fileId) {
        const transcript = await storageService.downloadFile(id, "text");
        allExtractedText += transcript;
      }

      const template = await storageService.downloadFile(
        templateId,
        "arraybuffer"
      );

      const typedTemplate: ArrayBuffer = template as ArrayBuffer;

      const contentString = await aiService.callAi(
        config.PROMPT_STRING,
        allExtractedText
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
