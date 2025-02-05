import fs from "fs";
import path from "path";
import PPTX from "nodejs-pptx";
import handleError from "../../utils/common/handleError";
import { Content, Slide, SlideText } from "../../interfaces/interfaces";
import Automizer from "pptx-automizer";

const uploadDir = path.join(__dirname, "..", "..", "upload");

const pptService = {
  createUploadFolder: async (template: ArrayBuffer) => {
    try {
      const inputFileName = "layout.pptx";
      const inputFilePath = path.join(uploadDir, inputFileName);

      const bufferTemplate = Buffer.from(template);
      await fs.promises.writeFile(inputFilePath, bufferTemplate);

      return inputFilePath;
    } catch (error) {
      handleError.serviceError(error, "creating upload folder");
      return;
    }
  },
  createTitleSlide: async (title: string, filePath: string) => {
    try {
      let pptx = new PPTX.Composer();
      await pptx.load(filePath);

      await pptx.compose(async (pres: any) => {
        let slide = await pres.getSlide("slide1");
        slide.addText((text: any) => {
          text
            .value(title)
            .x(1)
            .y(1.5)
            .fontSize(36)
            .fontFace("Arial")
            .textColor("000000")
            .textWrap("none");
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
  ) => {
    try {
      let pptx = new PPTX.Composer();
      await pptx.load(filePath);

      await pptx.compose(async (pres: any) => {
        let slide = await pres.getSlide("slide1");
        slide.addText((text: any) => {
          text
            .value(entry.header)
            .x(10)
            .y(80)
            .fontSize(36)
            .fontFace("Arial")
            .textColor("000000")
            .textWrap("none");
        });

        entry.text.forEach((item: SlideText, index: number) => {
          slide.addText((text: any) => {
            text
              .value(item.statement)
              .x(10)
              .y(200 + index * 100)
              .fontSize(18)
              .fontFace("Arial")
              .textColor("000000")
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
  mergeSlides: async (slides: string[]) => {
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
      } catch (error) {
        handleError.serviceError(error, "merging slides");
        return;
      }
    }
    execute();
  },
  createPpt: async (template: ArrayBuffer, content: Content, title: string) => {
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

      await pptService.mergeSlides(slideNames);
    } catch (error) {
      handleError.serviceError(error, "creating presentation");
      return;
    }
  },
};

export default pptService;
