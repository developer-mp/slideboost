import { Router, Request, Response } from "express";
import { z } from "zod";
import crypto from "crypto";
import { buildCustomPptx } from "../generator/pptxBuilder";
import {
  buildOutputFileName,
  getPptxBufferById,
  savePptxFile,
} from "../storage/fileStore";

const createPresentationSchema = z.object({
  title: z.string().trim().min(1).max(180),
  text: z.string().trim().min(1),
  maxBulletsPerSlide: z.number().int().min(2).max(8).default(5),
  maxWordsPerBullet: z.number().int().min(4).max(24).default(14),
});

export const presentationRoutes = Router();

presentationRoutes.post(
  "/v1/presentations",
  async (req: Request, res: Response) => {
    const parsed = createPresentationSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: "Invalid payload",
        issues: parsed.error.issues,
      });
      return;
    }

    const payload = parsed.data;
    const id = crypto.randomUUID();

    try {
      const result = await buildCustomPptx({
        title: payload.title,
        bodyText: payload.text,
        maxBulletsPerSlide: payload.maxBulletsPerSlide,
        maxWordsPerBullet: payload.maxWordsPerBullet,
      });

      const fileName = buildOutputFileName(id);
      savePptxFile(fileName, result.fileBuffer);

      res.status(201).json({
        id,
        fileName,
        downloadUrl: `/v1/presentations/${id}/download`,
        slideCount: result.slideCount,
      });
    } catch (error) {
      console.error("Error generating custom PPTX:", error);
      res.status(500).json({
        message: "Failed to generate presentation",
      });
    }
  },
);

presentationRoutes.get(
  "/v1/presentations/:id/download",
  (req: Request, res: Response) => {
    const { id } = req.params;
    const content = getPptxBufferById(id);

    if (!content) {
      res.status(404).json({
        message: "Presentation not found",
      });
      return;
    }

    const fileName = buildOutputFileName(id);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=\"${fileName}\"`,
    );
    res.status(200).send(content);
  },
);
