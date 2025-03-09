import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { getUploadDir } from "../common/getUploadDir";
import { clearUploadFolder } from "../storage/clearUploadFolder";

const uploadDir = getUploadDir();

export const convertPptToPng = async (pptBuffer: Buffer): Promise<Buffer> => {
  const tempPptFilePath = path.join(uploadDir, "temp.pptx");
  fs.writeFileSync(tempPptFilePath, pptBuffer);

  const command = "soffice";
  const args = [
    "--headless",
    "--convert-to",
    "png",
    "--outdir",
    uploadDir,
    tempPptFilePath,
  ];

  const sofficeProcess = spawn(command, args);

  let errorData: Buffer[] = [];

  return new Promise<Buffer>((resolve, reject) => {
    sofficeProcess.stderr.on("data", (data) => {
      errorData.push(data);
    });

    sofficeProcess.on("close", async (code) => {
      fs.unlinkSync(tempPptFilePath);

      if (code !== 0) {
        reject(
          `Error converting PPT to PNG: ${Buffer.concat(errorData).toString()}`
        );
        return;
      }

      const outputPngPath = path.join(uploadDir, "temp.png");

      if (fs.existsSync(outputPngPath)) {
        const pngBuffer = fs.readFileSync(outputPngPath);
        resolve(pngBuffer);
      } else {
        reject("Error creating PNG file");
      }

      await clearUploadFolder();
    });
  });
};
