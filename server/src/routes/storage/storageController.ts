import { Request, Response } from "express";
import storageService from "../../services/storage/storageService";
import handleError from "../../utils/common/handleError";
import { config } from "../../../env.config";
import { pool } from "../../db/config/pool";
import { Content, DbQueryResultProps } from "../../interfaces/interfaces";
import { convertPptToPng } from "../../utils/conversion/convertPptToPng";
import { changeFileExtension } from "../../utils/conversion/changeFileExtension";
import aiService from "./../../services/ai/aiService";
import pptService from "../../services/ppt/pptService";

const storageController = {
  uploadFileToStorage: async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId as string;
    const folder = req.query.folder as string;

    if (!req.file) {
      res.status(400).json({ message: "No file found" });
      return;
    }

    if (!userId || !folder) {
      res.status(400).json({ message: "User ID and folder are required" });
      return;
    }

    try {
      const fileName = req.file.originalname;
      const filePath = `${userId}/${folder}/${fileName}`;
      const fileType = req.file.mimetype;
      const category = req.body.category;

      const response = await storageService.uploadFile(
        req.file.buffer,
        filePath,
        config.STORAGE_BUCKET_ID as string
      );

      if (!response) {
        res
          .status(500)
          .json({ message: "Failed to upload the file to the storage" });
        return;
      }

      const fileId = response.fileId;
      const storageFileName = response.fileName;
      const fileUrl = `https://${config.STORAGE_BUCKET_NAME}.${config.STORAGE_ENDPOINT}/${filePath}`;
      const uploadedAt = new Date();
      const fileSize = req.file.size;

      let pngUrl = null;
      if (folder === "templates") {
        // const pngBuffer = await convertPptToPng(req.file.buffer);
        const buffer =
          "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E3YAgNKEHQCgNGEHAChN2AEAShN2AIDShB0AoDRhBwAoTdgBAEoTdgCA0oQdAKA0YQcAKE3YAQBKE3YAgNKEHQCgNGEHAChN2AEAShN2AIDShB0AoDRhBwAoTdgBAEoTdgCA0oQdAKA0YQcAKE3YAQBKE3YAgNKEHQCgNGEHAChN2AEAShN2AIDShB0AoDRhBwAoTdgBAEoTdgCA0oQdAKA0YQcAKE3YAQBKE3YAgNKEHQCgNGEHAChN2AEAShN2AIDShB0AoDRhBwAoTdgBAEoTdgCA0oQdAKA0YQcAKE3YAQBKE3YAgNKEHQCgNGEHAChN2AEAShN2AIDShB0AoDRhBwAoTdgBAEoTdgCA0oQdAKA0YQcAKE3YAQBKE3YAgNKEHQCgNGEHAChN2AEAShN2AIDShB0AoDRhBwAoTdgBAEoTdgCA0oQdAKA0YQcAKE3YAQBKE3YAgNKEHQCgNGEHAChN2AEAShN2AIDShB0AoDRhBwAoTdgBAEoTdgCA0oQdAKA0YQcAKE3YAQBKE3YAgNKEHQCgNGEHAChN2AEAShN2AIDShB0AoDRhBwAoTdgBAEoTdgCA0oQdAKA0YQcAKO3/AG/MDk/xCkk0AAAAAElFTkSuQmCC";
        const pngBuffer = Buffer.from(buffer, "base64");

        const pngFileName = changeFileExtension(fileName, ".png");
        const pngFilePath = `${userId}/${folder}/${pngFileName}`;

        await storageService.uploadFile(
          pngBuffer,
          pngFilePath,
          config.STORAGE_BUCKET_ID as string
        );

        pngUrl = `https://${config.STORAGE_BUCKET_NAME}.${config.STORAGE_ENDPOINT}/${pngFilePath}`;
      }

      (await pool.query(
        "INSERT INTO files(name, file_name, type, size, folder, template_category, file_id, file_url, png_url, uploaded_at, user_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [
          fileName,
          storageFileName,
          fileType,
          fileSize,
          folder,
          category,
          fileId,
          fileUrl,
          pngUrl,
          uploadedAt,
          userId,
        ]
      )) as DbQueryResultProps;

      res.status(200).json({ message: "File uploaded successfully" });
    } catch (error: unknown) {
      handleError.controllerError(
        res,
        error,
        "uploading the file to the storage"
      );
      return;
    }
  },

  getFileMetadata: async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    try {
      const result = (await pool.query(
        "SELECT name, file_name, type, size, folder, template_category, file_id, file_url, png_url, uploaded_at FROM files WHERE user_id = $1",
        [userId]
      )) as DbQueryResultProps;

      res.status(200).json({
        message: "Metadata retrieved successfully",
        data: result.rows,
      });
      return;
    } catch (error: unknown) {
      handleError.controllerError(
        res,
        error,
        "retrieving the file metadata from the storage"
      );
      return;
    }
  },

  downloadFileFromStorage: async (
    req: Request,
    res: Response
  ): Promise<void> => {
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

      const ppt = await pptService.createPpt(typedTemplate, content, title);

      res.status(200).json({
        message: "Content created successfully",
        data: ppt,
      });
    } catch (error: unknown) {
      handleError.controllerError(
        res,
        error,
        "downloading the file from the storage"
      );
      return;
    }
  },

  deleteFileFromStorage: async (req: Request, res: Response): Promise<void> => {
    const fileId = req.query.fileId as string;
    const fileName = req.query.fileName as string;

    if (!fileId) {
      res.status(400).json({ message: "File ID is required" });
      return;
    }

    if (!fileName) {
      res.status(400).json({ message: "File name is required" });
      return;
    }

    try {
      await storageService.deleteFile(fileId, fileName);

      (await pool.query("DELETE FROM files WHERE file_id = $1", [
        fileId,
      ])) as DbQueryResultProps;

      res.status(200).json({ message: "File deleted successfully" });
      return;
    } catch (error: unknown) {
      handleError.controllerError(
        res,
        error,
        "deleting the file from the storage"
      );
      return;
    }
  },
};

export default storageController;
