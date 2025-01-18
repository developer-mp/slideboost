import { Request, Response } from "express";
import Tesseract from "tesseract.js";
import fs from "fs";
import { spawn } from "child_process";
import path from "path";
import { convertMp3ToWav } from "../../utils/transcript/convertMp3ToWav";
import { extractWavFromVideo } from "../../utils/transcript/extractWavFromVideo";
import { downloadVideoFromYoutube } from "../../utils/transcript/downloadVideoFromYoutube";
import { readTextFile } from "../../utils/transcript/readTextFile";
import handleError from "../../utils/common/handleError";

const TranscriptController = {
  convertTextToText: async (req: Request, res: Response): Promise<void> => {
    const { filePath } = req.body;
    try {
      const absoluteFilePath = path.join(__dirname, filePath);

      if (!filePath) {
        res.status(400).json({ message: "File path is required" });
        return;
      }

      if (!fs.existsSync(absoluteFilePath)) {
        res.status(404).json({ message: "File not found" });
        return;
      }

      const result = readTextFile(absoluteFilePath);
      res.json({ text: result });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "processing the text");
      return;
    }
  },
  convertImageToText: async (req: Request, res: Response): Promise<void> => {
    const { filePath } = req.body;
    try {
      const absoluteFilePath = path.join(__dirname, filePath);

      if (!filePath) {
        res.status(400).json({ message: "File path is required" });
        return;
      }

      if (!fs.existsSync(absoluteFilePath)) {
        res.status(404).json({ message: "File not found" });
        return;
      }

      const buffer = fs.readFileSync(absoluteFilePath);

      const result = await Tesseract.recognize(buffer, "eng");
      res.json({ text: result.data.text });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "processing the image");
      return;
    }
  },
  convertAudioToText: async (req: Request, res: Response): Promise<void> => {
    const { filePath } = req.body;
    try {
      const absoluteFilePath = path.join(__dirname, filePath);

      if (!filePath) {
        res.status(400).json({ message: "File path is required" });
        return;
      }

      if (!fs.existsSync(absoluteFilePath)) {
        res.status(404).json({ message: "File not found" });
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
        fs.unlinkSync(wavFilePath);
        if (code !== 0) {
          res.status(500).json({ message: "Python processing error" });
        } else {
          res.json({ text: scriptOutput.trim() });
        }
      });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "processing the audio");
      return;
    }
  },
  convertVideoToText: async (req: Request, res: Response): Promise<void> => {
    const { filePath } = req.body;
    try {
      const absoluteFilePath = path.join(__dirname, filePath);

      if (!filePath) {
        res.status(400).json({ message: "File path is required" });
        return;
      }

      if (!fs.existsSync(absoluteFilePath)) {
        res.status(404).json({ message: "File not found" });
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
        fs.unlinkSync(wavFilePath);
        if (code !== 0) {
          res.status(500).json({ message: "Python processing error" });
        } else {
          res.json({ text: scriptOutput.trim() });
        }
      });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "processing the video");
      return;
    }
  },
  convertYoutubeToText: async (req: Request, res: Response): Promise<void> => {
    const { filePath } = req.body;
    try {
      if (!filePath) {
        res.status(400).json({ message: "YouTube URL is required" });
        return;
      }

      const videoFilePath = await downloadVideoFromYoutube(filePath);

      const wavFilePath = videoFilePath.replace(
        path.extname(videoFilePath),
        ".wav"
      );

      await extractWavFromVideo(videoFilePath, wavFilePath);

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
        fs.unlinkSync(wavFilePath);
        if (code !== 0) {
          res.status(500).json({ message: "Python processing error" });
        } else {
          res.json({ text: scriptOutput.trim() });
        }
      });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "processing the Youtube video");
      return;
    }
  },
};

export default TranscriptController;
