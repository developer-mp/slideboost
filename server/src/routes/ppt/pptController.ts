type TextOptions = {
  value: (text: string) => TextOptions;
  x: (position: number) => TextOptions;
  y: (position: number) => TextOptions;
  fontSize: (size: number) => TextOptions;
  fontFace: (font: string) => TextOptions;
  textColor: (color: string) => TextOptions;
};

type SlideOptions = {
  addText: (callback: (text: TextOptions) => void) => void;
};

import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import PPTX from "nodejs-pptx";

const PptController = {
  createPpt: async (req: Request, res: Response): Promise<void> => {
    try {
      const { filePath, transcript } = req.body;
      const absoluteFilePath = path.join(__dirname, filePath);

      if (!filePath) {
        res.status(400).json({ error: "File path is required" });
        return;
      }

      if (!fs.existsSync(absoluteFilePath)) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      const pptx = new PPTX.Composer();
      await pptx.load(absoluteFilePath);

      await pptx.compose(async (pres: any) => {
        await pres.getSlide("slide1").addText((text: TextOptions) => {
          text
            .value(transcript)
            .x(1)
            .y(1)
            .fontSize(18)
            .fontFace("Arial")
            .textColor("000000");
        });
      });

      const uploadDir = path.join(__dirname, "..", "..", "upload");
      const outputFileName = "generated_presentation.pptx";
      const outputFilePath = path.join(uploadDir, outputFileName);
      await pptx.save(outputFilePath);

      res.status(200).json([
        {
          id: "123",
          name: outputFileName,
          type: "pptx",
          size: 123,
          date: "2024-01-01",
          content: "content",
          thumbnail: "123",
          title: "Presentation",
          category: "Business",
          path: outputFilePath,
        },
      ]);
    } catch (error) {
      console.error("Error processing text:", error);
      res.status(500).json({ error: "Failed to process text" });
    }
  },
};

export default PptController;
