import fs from "fs";

export const convertImgToBase64 = (imagePath: string): string => {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString("base64");
};
