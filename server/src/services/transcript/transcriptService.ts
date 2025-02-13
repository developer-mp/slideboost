import { Request, Response } from "express";
import Tesseract from "tesseract.js";
import fs from "fs";
import { spawn } from "child_process";
import path from "path";
import { convertMp3ToWav } from "../../utils/transcript/convertMp3ToWav";
import { extractWavFromVideo } from "../../utils/transcript/extractWavFromVideo";
import { downloadVideoFromYoutube } from "../../utils/transcript/downloadVideoFromYoutube";
// import { readTextFile } from "../../utils/transcript/readTextFile";
import handleError from "../../utils/common/handleError";
import { getUploadDir } from "../../utils/common/getUploadDir";

const uploadDir = getUploadDir();

const transcriptService = {
  convertImageToText: async (buffer: Buffer): Promise<string> => {
    try {
      const result = await Tesseract.recognize(buffer, "eng");
      return result.data.text;
    } catch (error: unknown) {
      handleError.serviceError(error, "processing the image");
      return "";
    }
  },

  convertAudioToText: async (buffer: Buffer): Promise<string> => {
    const isMp3 = (buffer: Buffer): boolean => {
      const id3Tag = buffer.subarray(0, 3).toString("utf8");
      if (id3Tag === "ID3") {
        return true;
      }

      return buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
    };

    const isWav = (buffer: Buffer): boolean => {
      return buffer.subarray(0, 4).toString("utf8") === "RIFF";
    };

    try {
      let wavBuffer = buffer;

      if (isMp3(buffer)) {
        wavBuffer = await convertMp3ToWav(buffer);
      } else if (isWav(buffer)) {
        wavBuffer = buffer;
      } else {
        throw new Error("Unsupported audio format");
      }

      const wavFilePath = path.join(uploadDir, "temp_audio.wav");
      fs.writeFileSync(wavFilePath, wavBuffer);

      const scriptPath = path.join(__dirname, "audioToText.py");

      const pythonProcess = spawn("python", [scriptPath, wavFilePath]);

      let scriptOutput = "";

      pythonProcess.stdout.on("data", (data) => {
        scriptOutput += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error("Python script stderr:", data.toString());
      });

      return new Promise((resolve, reject) => {
        pythonProcess.on("close", (code) => {
          fs.unlinkSync(wavFilePath);

          if (code !== 0) {
            reject(new Error("Python processing error"));
          } else {
            resolve(scriptOutput.trim());
          }
        });
      });
    } catch (error: unknown) {
      handleError.serviceError(error, "processing the audio");
      return "";
    }
  },

  convertVideoToText: async (req: Request, res: Response): Promise<void> => {
    const { filePath } = req.body;
    try {
      const absoluteFilePath = path.join(uploadDir, filePath);

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

      const scriptPath = path.join(uploadDir, "audioToText.py");

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
      handleError.serviceError(error, "processing the video");
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

      const scriptPath = path.join(uploadDir, "audioToText.py");

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
      handleError.serviceError(error, "processing the Youtube video");
      return;
    }
  },
};

export default transcriptService;
