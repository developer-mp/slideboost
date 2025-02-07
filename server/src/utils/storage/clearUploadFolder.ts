import fs from "fs";
import path from "path";
import handleError from "../common/handleError";

const uploadDir = path.join(__dirname, "..", "..", "upload");

export const clearUploadFolder = async () => {
  try {
    const files = await fs.promises.readdir(uploadDir);

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      await fs.promises.unlink(filePath);
    }
  } catch (err) {
    handleError.serviceError(err, "clearing upload folder");
  }
};
