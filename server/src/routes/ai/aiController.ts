import { Request, Response } from "express";
import Tesseract from "tesseract.js";
import { Buffer } from "buffer";

const AIController = {
  convertImageToText: async (req: Request, res: Response): Promise<void> => {
    try {
      const { image } = req.body;

      if (!image || !Array.isArray(image)) {
        res.status(400).json({ error: "No image provided" });
        return;
      }

      const results = await Promise.all(
        image.map(async (base64Data) => {
          const buffer = Buffer.from(base64Data.split(",")[1], "base64");
          const result = await Tesseract.recognize(buffer, "eng");
          return { text: result.data.text };
        })
      );

      res.json({ results });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ error: "Failed to process image" });
    }
  },
};

export default AIController;
