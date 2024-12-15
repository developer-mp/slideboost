import { Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { config } from "../../../env.config";

const AiController = {
  formatTranscript: async (req: Request, res: Response): Promise<void> => {
    const { transcript } = req.body;
    try {
      if (!transcript) {
        res.status(400).json({ error: "No transcript provided" });
        return;
      }

      const tempFilePath = path.join(__dirname, "temp_transcript.txt");
      fs.writeFileSync(tempFilePath, transcript);

      const scriptPath = path.join(__dirname, "huggingFaceApi.py");

      const pythonProcess = spawn("python", [
        scriptPath,
        tempFilePath,
        config.PROMPT_STRING,
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
          "An error occurred while formatting the transcript in the AI Controller: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while formatting the transcript in the AI Controller"
        );
      }
      res.status(500).json({
        message:
          "An error occurred while formatting the transcript in the AI Controller",
        error,
      });
      return;
    }
  },
};

export default AiController;
