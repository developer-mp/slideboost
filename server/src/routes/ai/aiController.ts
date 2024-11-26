import { Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const AiController = {
  formatTranscript: async (req: Request, res: Response): Promise<void> => {
    try {
      const { transcript } = req.body;

      if (!transcript) {
        res.status(400).json({ error: "No transcript provided" });
        return;
      }

      const promptText =
        "Rewrite and clean the following transcript by removing all non-readable characters. Don't include the prompt: ";

      const tempFilePath = path.join(__dirname, "temp_transcript.txt");
      fs.writeFileSync(tempFilePath, transcript);

      const scriptPath = path.join(__dirname, "huggingFaceApi.py");

      const pythonProcess = spawn("python", [
        scriptPath,
        tempFilePath,
        promptText,
      ]);

      let scriptOutput = "";

      pythonProcess.stdout.on("data", (data) => {
        scriptOutput += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error("Python script stderr:", data.toString());
      });

      pythonProcess.on("close", (code) => {
        fs.unlinkSync(tempFilePath);
        if (code !== 0) {
          res.status(500).json({ error: "Python processing error" });
        } else {
          res.json({ text: scriptOutput.trim() });
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while formatting the transcript: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while formatting the transcript"
        );
      }
      res
        .status(500)
        .json({ error: "An error occurred while formatting the transcript" });
      return;
    }
  },
};

export default AiController;
