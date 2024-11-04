// import pptxgen from "pptxgenjs";
// import path from "path";
// import pptx2pdf from "pptx2pdf";
// import { defineTemplate1 } from "../../templates/ppt/template1";
// import { defineTemplate2 } from "../../templates/ppt/template2";
// import { defineTemplate3 } from "../../templates/ppt/template3";
// import { titleTemplate } from "../../templates/ppt/titleTemplate";

// const templateFunctions: { [key: number]: (pptx: pptxgen) => void } = {
//   1: defineTemplate1,
//   2: defineTemplate2,
//   3: defineTemplate3,
// };

// const pptService = {
//   async createPPT(templateId: number, transcript: any) {
//     const pptx = new pptxgen();

//     if (templateFunctions[templateId]) {
//       templateFunctions[templateId](pptx);
//     } else {
//       throw new Error("Template not found");
//     }

//     pptx.layout = "LAYOUT_WIDE";

//     titleTemplate(pptx, transcript.title);

//     try {
//       transcript.slides.forEach(
//         (entry: {
//           header: string | pptxgen.TextProps[];
//           text: { id: number; statement: string | pptxgen.TextProps[] }[];
//         }) => {
//           let slide = pptx.addSlide({
//             masterName: `MASTER_SLIDE_TEMPLATE_${templateId}`,
//           });

//           slide.addText(entry.header, {
//             x: 2.0,
//             y: 0.8,
//             fontSize: 24,
//             bold: true,
//           });

//           entry.text.forEach((item, index) => {
//             slide.addText(item.statement, {
//               x: 1.0,
//               y: 3.0 + index * 0.5,
//               fontSize: 18,
//               w: "80%",
//               bullet: true,
//             });
//           });
//         }
//       );

//       const filePath = path.join(
//         __dirname,
//         `Presentation_template_${templateId}.pptx`
//       );
//       await pptx.writeFile({ fileName: filePath });
//       return filePath;
//     } catch (error) {
//       console.error("Error creating PowerPoint file:", error);
//     }
//   },
//   async createPDF(ppt: any) {
//     try {
//       const outputPath = path.join(__dirname, "output.pdf");
//       await pptx2pdf.convert(ppt, outputPath);
//     } catch (error) {
//       console.error("Error creating PDF file:", error);
//     }
//   },
// };

// export default pptService;
