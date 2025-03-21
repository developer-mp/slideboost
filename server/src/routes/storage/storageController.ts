import { Request, Response } from "express";
import storageService from "../../services/storage/storageService";
import handleError from "../../utils/common/handleError";
import { config } from "../../../env.config";
import { pool } from "../../db/config/pool";
import { DbQueryResultProps } from "../../interfaces/interfaces";
import { convertPptToPng } from "../../utils/conversion/convertPptToPng";
import { changeFileExtension } from "../../utils/conversion/changeFileExtension";

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

      if (folder === "templates") {
        const pngBuffer = await convertPptToPng(req.file.buffer);
        const pngFileName = changeFileExtension(fileName, ".png");
        const pngFilePath = `${userId}/${folder}/${pngFileName}`;

        await storageService.uploadFile(
          pngBuffer,
          pngFilePath,
          config.STORAGE_BUCKET_ID as string
        );
      }

      (await pool.query(
        "INSERT INTO files(name, file_path, type, size, folder, template_category, file_id, file_url, uploaded_at, user_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [
          fileName,
          storageFileName,
          fileType,
          fileSize,
          folder,
          category,
          fileId,
          fileUrl,
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
      let result;

      if (userId === "system") {
        result = (await pool.query(
          "SELECT name, file_path, type, size, folder, template_category, file_id, file_url, uploaded_at, source FROM files WHERE source = $1",
          [userId]
        )) as DbQueryResultProps;
      } else {
        result = (await pool.query(
          "SELECT name, file_path, type, size, folder, template_category, file_id, file_url, uploaded_at, source FROM files WHERE user_id = $1 OR source = 'system'",
          [userId]
        )) as DbQueryResultProps;
      }

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

  downloadFileFromStorage: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const fileId = req.query.fileId as string;

    if (!fileId) {
      res.status(400).json({ message: "File ID is required" });
      return;
    }

    try {
      const file = await storageService.downloadFile(fileId, "arraybuffer");

      res.status(200).json({
        data: file,
        message: "File downloaded successfully",
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
};

export default storageController;
