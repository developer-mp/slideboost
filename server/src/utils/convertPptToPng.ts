import fs from "fs";
import path from "path";
import { spawn } from "child_process";

export const convertPptToPng = (pptBuffer: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const tempPptFilePath = path.join(__dirname, "temp.pptx");
    fs.writeFileSync(tempPptFilePath, pptBuffer);

    const tempOutputDir = path.join(__dirname, "tempOutput");
    if (!fs.existsSync(tempOutputDir)) {
      fs.mkdirSync(tempOutputDir);
    }

    const command = "soffice";
    const args = [
      "--headless",
      "--convert-to",
      "png",
      "--outdir",
      tempOutputDir,
      tempPptFilePath,
    ];

    const sofficeProcess = spawn(command, args);

    let errorData: Buffer[] = [];

    sofficeProcess.stderr.on("data", (data) => {
      errorData.push(data);
    });

    sofficeProcess.on("close", (code) => {
      fs.unlinkSync(tempPptFilePath);

      if (code !== 0) {
        reject(
          `Error converting PPT to PNG: ${Buffer.concat(errorData).toString()}`
        );
      } else {
        const outputPngPath = path.join(tempOutputDir, "temp.png");

        if (fs.existsSync(outputPngPath)) {
          const pngBuffer = fs.readFileSync(outputPngPath);
          fs.unlinkSync(outputPngPath);
          fs.rmdirSync(tempOutputDir);
          resolve(pngBuffer);
        } else {
          reject("Error creating PNG file");
        }
      }
    });
  });
};
