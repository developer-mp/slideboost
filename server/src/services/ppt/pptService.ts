import fs from "fs";
import path from "path";
import PPTX from "nodejs-pptx";
import handleError from "../../utils/common/handleError";
import {
  Content,
  DbQueryResultProps,
  Slide,
  SlideText,
} from "../../interfaces/interfaces";
import Automizer from "pptx-automizer";
import { pool } from "../../db/config/pool";
import storageService from "../storage/storageService";
import { config } from "../../../env.config";
import { getUploadDir } from "../../utils/common/getUploadDir";
import transcriptService from "../transcript/transcriptService";
import { clearUploadFolder } from "../../utils/storage/clearUploadFolder";

const uploadDir = getUploadDir();

const pptService = {
  createUploadFolder: async (template: ArrayBuffer): Promise<string> => {
    try {
      const inputFileName = "layout.pptx";
      const inputFilePath = path.join(uploadDir, inputFileName);

      const bufferTemplate = Buffer.from(template);
      await fs.promises.writeFile(inputFilePath, bufferTemplate);

      return inputFilePath;
    } catch (error) {
      handleError.serviceError(error, "creating upload folder");
      return "";
    }
  },

  createTitleSlide: async (title: string, filePath: string): Promise<void> => {
    try {
      let pptx = new PPTX.Composer();
      await pptx.load(filePath);

      await pptx.compose(async (pres: any) => {
        let slide = await pres.getSlide("slide1");
        slide.addText((text: any) => {
          text
            .value(title)
            .x(220)
            .y(150)
            .fontSize(28)
            .fontFace("Arial")
            .textColor("000000")
            .textWrap("none")
            .margin(0)
            .textAlign("center");
        });
      });

      const outputFileName = "slide1.pptx";
      const outputFilePath = path.join(uploadDir, outputFileName);
      await pptx.save(outputFilePath);
    } catch (error) {
      handleError.serviceError(error, "creating title slide");
      return;
    }
  },

  createContentSlide: async (
    entry: Slide,
    filePath: string,
    slideNum: number
  ): Promise<void> => {
    try {
      let pptx = new PPTX.Composer();
      await pptx.load(filePath);

      await pptx.compose(async (pres: any) => {
        pres.layout("LAYOUT_WIDE");
        let slide = await pres.getSlide("slide1");
        slide.addText((text: any) => {
          text
            .value(entry.header)
            .x(20)
            .y(30)
            .fontSize(24)
            .fontFace("Arial")
            .textColor("000000")
            .margin(0)
            .textWrap("none");
        });

        entry.text.forEach((item: SlideText, index: number) => {
          slide.addText((text: any) => {
            text
              .value(`• ${item.statement}`)
              .x(20)
              .y(130 + index * 60)
              .fontSize(16)
              .fontFace("Arial")
              .textColor("000000")
              .margin(0)
              .textWrap("none");
          });
        });
      });

      const outputFileName = `slide${slideNum}.pptx`;
      const outputFilePath = path.join(uploadDir, outputFileName);
      await pptx.save(outputFilePath);
    } catch (error) {
      handleError.serviceError(error, "creating content slide");
      return;
    }
  },

  mergeSlides: async (slides: string[]): Promise<string> => {
    const automizer = new Automizer({
      templateDir: uploadDir,
      outputDir: uploadDir,
    });
    function buildPresentation(templates: any) {
      let presentation = automizer.loadRoot(templates[0]);
      if (templates.length > 1) {
        for (let i = 1; i < templates.length; i++) {
          presentation.load(templates[i], `template-${i}`);
        }
      }
      return presentation;
    }
    async function addSlides(files: any, pres: any) {
      for (let i = 1; i < files.length; i++) {
        const slideNumbers = await pres
          .getTemplate(`template-${i}`)
          .getAllSlideNumbers();
        slideNumbers.forEach((slideNumber: any) => {
          pres.addSlide(`template-${i}`, slideNumber);
        });
      }
    }
    async function execute() {
      try {
        let pres = buildPresentation(slides);

        await addSlides(slides, pres);
        const zipfile = await pres.getJSZip();
        const bufferfile = await zipfile.generateAsync({ type: "nodebuffer" });
        const outputFile = path.join(uploadDir, "presentation.pptx");
        await fs.promises.writeFile(outputFile, bufferfile);
        return outputFile;
      } catch (error) {
        handleError.serviceError(error, "merging slides");
        return "";
      }
    }
    return await execute();
  },

  createPpt: async (
    template: ArrayBuffer,
    content: Content,
    title: string
  ): Promise<string> => {
    if (!template) {
      throw new Error("Template not found");
    }

    if (!content) {
      throw new Error("Content not found");
    }

    if (!title) {
      throw new Error("Title not found");
    }

    const templatePath = await pptService.createUploadFolder(template);

    if (!templatePath) {
      throw new Error("Template path not found");
    }

    try {
      await pptService.createTitleSlide(title, templatePath);

      const slideNames = ["slide1.pptx"];
      for (let i = 0; i < content.slides.length; i++) {
        const slideContent = content.slides[i];
        const slideNum = i + 2;
        const slideFileName = `slide${slideNum}.pptx`;

        await pptService.createContentSlide(
          slideContent,
          templatePath,
          slideNum
        );

        slideNames.push(slideFileName);
      }

      const pptPath = await pptService.mergeSlides(slideNames);
      return pptPath;
    } catch (error) {
      handleError.serviceError(error, "creating presentation");
      return "";
    }
  },

  uploadPptToStorage: async (
    userId: string,
    pptFilePath: string
  ): Promise<void> => {
    if (!pptFilePath) {
      throw new Error("No file found");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    const folder = "projects";
    const fileBuffer = fs.readFileSync(pptFilePath);

    try {
      const fileName = `presentation_${new Date().toISOString()}.pptx`;
      const filePath = `${userId}/${folder}/${fileName}`;
      const fileType =
        "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      const category = null;

      const response = await storageService.uploadFile(
        fileBuffer,
        filePath,
        config.STORAGE_BUCKET_ID
      );

      if (!response) {
        throw new Error("Failed to upload the file to the storage");
      }

      const fileId = response.fileId;
      const storageFileName = response.fileName;
      const fileUrl = `https://${config.STORAGE_BUCKET_NAME}.${config.STORAGE_ENDPOINT}/${filePath}`;
      const uploadedAt = new Date();
      const fileSize = fileBuffer.length;

      (await pool.query(
        "INSERT INTO files(name, file_path, type, size, folder, template_category, file_id, file_url, uploaded_at, user_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [
          fileName,
          storageFileName,
          fileType,
          fileSize,
          folder,
          category,
          fileId,
          fileUrl,
          uploadedAt,
          userId,
        ]
      )) as DbQueryResultProps;
    } catch (error: unknown) {
      handleError.serviceError(
        error,
        "uploading the presentation to the storage"
      );
      return;
    }
  },

  generateTranscript: async (
    files: { file_id: string; file_type: string }[]
  ): Promise<string> => {
    if (!files) {
      throw new Error("File is required");
    }

    try {
      let extractedText = "";
      const textFormats = ["text"];

      for (const file of files) {
        const { file_id, file_type } = file;
        const fileType = file_type.split("/")[0].toLowerCase();
        const fileFormat = file_type.split("/")[1].toLowerCase();
        const format = textFormats.includes(fileType) ? "text" : "arraybuffer";
        let transcript = "";

        if (format === "text") {
          transcript = await storageService.downloadFile(file_id, format);
        } else {
          const buffer = (await storageService.downloadFile(
            file_id,
            format
          )) as Buffer;
          if (fileType == "image") {
            transcript = await transcriptService.convertImageToText(buffer);
          } else if (fileType == "audio") {
            transcript = await transcriptService.convertAudioToText(buffer);
          } else if (fileType == "video") {
            transcript = await transcriptService.convertVideoToText(buffer);
          } else if (fileType == "application") {
            if (
              fileFormat ==
              "vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
              transcript = await transcriptService.convertDocsToText(buffer);
            } else if (fileFormat == "pdf") {
              transcript = await transcriptService.convertPdfToText(buffer);
            }
          }
        }
        extractedText += transcript;
      }

      await clearUploadFolder();

      return extractedText;
    } catch (error: unknown) {
      handleError.serviceError(error, "generating the transcript");
      return "";
    }
  },
};

export default pptService;
