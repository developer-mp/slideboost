import { Request, Response } from "express";
import Tesseract from "tesseract.js";
import fs from "fs";
import { spawn } from "child_process";
import path from "path";
import { convertMp3ToWav } from "../../utils/convertMp3ToWav";
import { extractWavFromVideo } from "../../utils/extractAudioFromVideo";

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

      const pythonProcess = spawn("python", [scriptPath, wavFilePath]);

      let scriptOutput = "";

      pythonProcess.stdout.on("data", (data) => {
        scriptOutput += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error("Python script stderr:", data.toString());
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          res.status(500).json({ error: "Python processing error" });
        } else {
          res.json({ text: scriptOutput.trim() });
        }
      });
    } catch (error) {
      console.error("Error processing audio:", error);
      res.status(500).json({ error: "Failed to process audio" });
    }
  },
  convertVideoToText: async (req: Request, res: Response): Promise<void> => {
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

      const wavFilePath = absoluteFilePath.replace(
        path.extname(absoluteFilePath),
        ".wav"
      );
      await extractWavFromVideo(absoluteFilePath, wavFilePath);

      const scriptPath = path.join(__dirname, "audioToText.py");

      const pythonProcess = spawn("python", [scriptPath, wavFilePath]);

      let scriptOutput = "";

      pythonProcess.stdout.on("data", (data) => {
        scriptOutput += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error("Python script stderr:", data.toString());
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          res.status(500).json({ error: "Python processing error" });
        } else {
          res.json({ text: scriptOutput.trim() });
        }
      });
    } catch (error) {
      console.error("Error processing video:", error);
      res.status(500).json({ error: "Failed to process video" });
    }
  },
};

export default TranscriptController;
