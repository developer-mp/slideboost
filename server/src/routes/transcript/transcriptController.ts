import { Request, Response } from "express";
import Tesseract from "tesseract.js";
import fs from "fs";
import { spawn } from "child_process";
import path from "path";
import { convertMp3ToWav } from "../../utils/convertMp3ToWav";
import { extractWavFromVideo } from "../../utils/extractWavFromVideo";
import { downloadVideoFromYoutube } from "../../utils/downloadVideoFromYoutube";
import { readTextFile } from "../../utils/readTextFile";

const TranscriptController = {
  convertTextToText: async (req: Request, res: Response): Promise<void> => {
    try {
      const { filePath } = req.body;
      const absoluteFilePath = path.join(__dirname, filePath);

      if (!filePath) {
        res.status(400).json({ error: "File path is required" });
        return;
      }

      if (!fs.existsSync(absoluteFilePath)) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      const result = readTextFile(absoluteFilePath);
      res.json({ text: result });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while processing the text: ",
          error.message
        );
      } else {
        console.error("An unknown error occurred while processing the text");
      }
      res
        .status(500)
        .json({ error: "An error occurred while processing the text" });
    }
  },
  convertImageToText: async (req: Request, res: Response): Promise<void> => {
    try {
      const { filePath } = req.body;
      const absoluteFilePath = path.join(__dirname, filePath);

      if (!filePath) {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while processing the image: ",
          error.message
        );
      } else {
        console.error("An unknown error occurred while processing the image");
      }
      res
        .status(500)
        .json({ error: "An error occurred while processing the image" });
    }
  },
  convertAudioToText: async (req: Request, res: Response): Promise<void> => {
    try {
      const { filePath } = req.body;
      const absoluteFilePath = path.join(__dirname, filePath);

      if (!filePath) {
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
        fs.unlinkSync(wavFilePath);
        if (code !== 0) {
          res.status(500).json({ error: "Python processing error" });
        } else {
          res.json({ text: scriptOutput.trim() });
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while processing the audio: ",
          error.message
        );
      } else {
        console.error("An unknown error occurred while processing the audio");
      }
      res
        .status(500)
        .json({ error: "An error occurred while processing the audio" });
    }
  },
  convertVideoToText: async (req: Request, res: Response): Promise<void> => {
    try {
      const { filePath } = req.body;
      const absoluteFilePath = path.join(__dirname, filePath);

      if (!filePath) {
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
        fs.unlinkSync(wavFilePath);
        if (code !== 0) {
          res.status(500).json({ error: "Python processing error" });
        } else {
          res.json({ text: scriptOutput.trim() });
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while processing the video: ",
          error.message
        );
      } else {
        console.error("An unknown error occurred while processing the video");
      }
      res
        .status(500)
        .json({ error: "An error occurred while processing the video" });
    }
  },
  convertYoutubeToText: async (req: Request, res: Response): Promise<void> => {
    try {
      const { filePath } = req.body;

      if (!filePath) {
        res.status(400).json({ error: "YouTube URL is required" });
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
          res.status(500).json({ error: "Python processing error" });
        } else {
          res.json({ text: scriptOutput.trim() });
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while processing the Youtube video: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while processing the Youtube video"
        );
      }
      res
        .status(500)
        .json({
          error: "An error occurred while processing the Youtube video",
        });
    }
  },
};

export default TranscriptController;
