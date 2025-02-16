import { Request, Response } from "express";
import storageService from "../../services/storage/storageService";
import handleError from "../../utils/common/handleError";
import { config } from "../../../env.config";
import { Content } from "../../interfaces/interfaces";
import aiService from "../../services/ai/aiService";
import pptService from "../../services/ppt/pptService";
import { clearUploadFolder } from "../../utils/storage/clearUploadFolder";
import transcriptService from "../../services/transcript/transcriptService";

const pptController = {
  createPresentation: async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId as string;
    const templateId = req.query.templateId as string;
    const title = req.query.title as string;
    const files = req.query.files as { file_id: string; file_type: string }[];

    if (!files) {
      res.status(400).json({ message: "File is required" });
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
      const textFormats = ["text"];

      for (const file of files) {
        const { file_id, file_type } = file;
        const fileType = file_type.split("/")[0].toLowerCase();
        const fileFormat = file_type.split("/")[1].toLowerCase();
        const format = textFormats.includes(fileType) ? "text" : "arraybuffer";
        let transcript = "";

        if (format === "text") {
          transcript = await storageService.downloadFile(file_id, format);
        } else {
          const buffer = (await storageService.downloadFile(
            file_id,
            format
          )) as Buffer;
          if (fileType == "image") {
            transcript = await transcriptService.convertImageToText(buffer);
          } else if (fileType == "audio") {
            transcript = await transcriptService.convertAudioToText(buffer);
          } else if (fileType == "video") {
            transcript = await transcriptService.convertVideoToText(buffer);
          } else if (fileType == "application") {
            if (
              fileFormat ==
              "vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
              transcript = await transcriptService.convertDocsToText(buffer);
            } else if (fileFormat == "pdf") {
              transcript = await transcriptService.convertPdfToText(buffer);
            }
          }
        }
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
