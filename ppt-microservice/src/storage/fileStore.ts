import fs from "fs";
import path from "path";
import { config } from "../config";

export function ensureOutputDir(): void {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
}

export function buildOutputFileName(id: string): string {
  return `presentation-${id}.pptx`;
}

export function buildOutputFilePath(fileName: string): string {
  return path.join(config.outputDir, fileName);
}

export function savePptxFile(fileName: string, content: Buffer): string {
  ensureOutputDir();
  const filePath = buildOutputFilePath(fileName);
  fs.writeFileSync(filePath, content);
  return filePath;
}

export function getPptxBufferById(id: string): Buffer | null {
  const fileName = buildOutputFileName(id);
  const filePath = buildOutputFilePath(fileName);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath);
}
