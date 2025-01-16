import { Request, Response } from "express";
import storageService from "../../services/storage/storageService";
import handleError from "../../utils/handleError";
import { config } from "../../../env.config";
import { pool } from "../../db/config/pool";
import { DbQueryResultProps } from "../../interfaces/interfaces";

const storageController = {
  uploadFileToStorage: async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const folder = req.query.folder;

    if (!req.file) {
      res.status(400).json({ message: "No file found" });
      return;
    }

    try {
      const fileName = req.file.originalname;
      const filePath = `${userId}/${folder}/${fileName}`;
      const fileType = req.file.mimetype;

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

      const fileUrl = `https://${config.STORAGE_BUCKET_NAME}.s3.us-east-005.backblazeb2.com/${filePath}`;
      const uploadedAt = new Date();
      const fileSize = req.file.size;

      (await pool.query(
        "INSERT INTO files(name, type, size, folder, file_url, uploaded_at, user_id) VALUES($1, $2, $3, $4, $5, $6, $7)",
        [fileName, fileType, fileSize, folder, fileUrl, uploadedAt, userId]
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
};

export default storageController;
