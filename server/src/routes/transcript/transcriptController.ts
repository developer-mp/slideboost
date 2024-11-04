import { Request, Response } from "express";
import Tesseract from "tesseract.js";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { convertMp3ToWav } from "../../utils/convertMp3ToWav";

const TranscriptController = {
  convertImageToText: async (req: Request, res: Response): Promise<void> => {
    try {
      const { filePath } = req.body;
      const absoluteFilePath = path.join(__dirname, filePath);

      if (!absoluteFilePath) {
        res.status(400).json({ error: "File path is required" });
        return;
      }

      if (!fs.existsSync(absoluteFilePath)) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      const buffer = fs.readFileSync(absoluteFilePath);

      const result = await Tesseract.recognize(buffer, "eng");
      res.json({ text: result.data.text });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ error: "Failed to process image" });
    }
  },
  convertAudioToText: async (req: Request, res: Response): Promise<void> => {
    try {
      const { filePath } = req.body;
      const absoluteFilePath = path.join(__dirname, filePath);

      if (!absoluteFilePath) {
        res.status(400).json({ error: "File path is required" });
        return;
      }

      if (!fs.existsSync(absoluteFilePath)) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      const wavFilePath = absoluteFilePath.replace(".mp3", ".wav");
      await convertMp3ToWav(absoluteFilePath, wavFilePath);

      const scriptPath = path.join(__dirname, "audioToText.py");

      exec(
        `python "${scriptPath}" "${wavFilePath}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error("Error executing Python script:", error);
            res.status(500).json({ error: "Failed to process audio" });
            return;
          }

          if (stderr) {
            console.error("Python script stderr:", stderr);
            res.status(500).json({ error: "Python processing error" });
            return;
          }

          res.json({ text: stdout.trim() });
        }
      );
    } catch (error) {
      console.error("Error processing audio:", error);
      res.status(500).json({ error: "Failed to process audio" });
    }
  },
};

export default TranscriptController;
