import fs from "fs";

export const readTextFile = (filePath: string): string => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return fileContent;
  } catch (error) {
    throw new Error("Error reading the text file");
  }
};
